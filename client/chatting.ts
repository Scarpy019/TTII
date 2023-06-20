import createDiffieHellman from 'create-ecdh';
import { fetchWithCSRF } from './hardening.js';
import { fromHex, randomBytes, toHex } from './crypto/cryptography.js';
import { ModeOfOperation, utils } from 'aes-js';
import $ from 'jquery';
import { io, type Socket } from 'socket.io-client';
import { getCookie } from './lib.js';

// Storage of all DH keypairs in local storage, each message has its own pair to ensure forward secrecy
interface Keypair {
	publicKey: string;
	privateKey: string;
};
interface CodeBook {
	messageKeypair: Map<string, Keypair>;
};
interface MessageQueue {
	awaitingKey: string[];
	pendingMessage: Map<string, string>; // MessageID, content
	decipheredMessages: Map<string, string>; // MessageID, content
}

function getUser (): string {
	return $('#user_id')[0].innerText;
}

function replacer (key: any, value: any): any {
	if (value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries()) // or with spread: value: [...value]
		};
	} else {
		return value;
	}
}

function reviver (key: any, value: any): any {
	if (typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
			return new Map(value.value);
		}
	}
	return value;
}

function getCodebook (): CodeBook {
	const userId = getUser();
	const codebookString = localStorage.getItem(userId + '-keys');
	if (codebookString === null) {
		const codebook: CodeBook = {
			messageKeypair: new Map<string, Keypair>()
		};
		return codebook;
	} else {
		const codebook: CodeBook = JSON.parse(codebookString, reviver);
		return codebook;
	}
}

function getMessageQueue (): MessageQueue {
	const userId = getUser();
	const queueString = localStorage.getItem(userId + '-queue');
	if (queueString === null) {
		const queue: MessageQueue = {
			awaitingKey: [],
			pendingMessage: new Map<string, string>(),
			decipheredMessages: new Map<string, string>()
		};
		return queue;
	} else {
		const queue: MessageQueue = JSON.parse(queueString, reviver) as MessageQueue;
		return queue;
	}
}

function queueMessage (messageId: string, messageContent: string): void {
	const queue = getMessageQueue();
	queue.pendingMessage.set(messageId, messageContent);
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));
}

function dequeueMessage (messageId: string): void {
	const queue = getMessageQueue();
	queue.pendingMessage.delete(messageId);
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));

	const messageList = document.getElementById('messages');
	if (messageList !== null) location.reload(); // reload the chat page so the new messages are visible
}

function awaitKey (messageId: string): void {
	const queue = getMessageQueue();
	queue.awaitingKey.push(messageId);
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));
}

function stopAwaitKey (messageId: string): void {
	const queue = getMessageQueue();
	const index = queue.awaitingKey.indexOf(messageId);
	if (index > -1) {
		queue.awaitingKey.splice(index, 1);
	}
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));
}

function saveMessage (messageId: string, messageContent: string): void {
	const queue = getMessageQueue();
	queue.decipheredMessages.set(messageId, messageContent);
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));
}

function saveKeypair (messageId: string, publicKey: string, privateKey: string): void {
	const codebook = getCodebook();
	codebook.messageKeypair.set(messageId, { publicKey, privateKey });
	localStorage.setItem(getUser() + '-keys', JSON.stringify(codebook, replacer));
}

function loadKeypair (messageId: string): Keypair | undefined {
	const codebook = getCodebook();
	return codebook.messageKeypair.get(messageId);
}

function sendAnnounce (recipientId: string, messageContent: string): void {
	const payload = {
		messageId: null,
		userId: recipientId,
		stage: 'ANNOUNCE',
		content: 'a|b'
	};
	fetchWithCSRF('/chat', {
		method: 'POST',
		body: JSON.stringify(payload)
	}).then(async res => {
		if (res.status !== 200) {
			console.error(`ANNOUNCE message returned ${res.status}`);
		} else {
			if (res.body !== null) {
				const payload = await res.text();
				queueMessage(payload, messageContent);
				saveMessage(payload, messageContent);
				sendKeyComponent(payload);
			}
		}
	}).catch(e => {
		console.error(`ANNOUNCE message to ${recipientId} failed: ${e as string}`);
	});
}

// interface DiffieHellmanData {
// 	publicKey: string;
// 	privateKey: string;
// }

function sendKeyComponent (messageId: string): void {
	const user = getUser();
	const dh = createDiffieHellman('secp256k1');
	const preexistingKey = loadKeypair(messageId);
	if (preexistingKey !== undefined) {
		awaitKey(messageId);
		return;
	}
	dh.generateKeys();
	const keycomp = dh.getPublicKey('hex') as string;
	saveKeypair(messageId, dh.getPublicKey('hex') as string, dh.getPrivateKey('hex') as string);
	const payload = {
		messageId,
		userId: null,
		stage: 'KEY',
		content: user + '|' + keycomp
	};
	fetchWithCSRF('/chat', {
		method: 'POST',
		body: JSON.stringify(payload)
	}).then(async res => {
		if (res.status !== 200) {
			console.error(`KEY message returned ${res.status}`);
		} else {
			awaitKey(messageId);
		}
	}).catch(e => {
		console.error(`KEY message to ${messageId} failed: ${e as string}`);
	});
}

async function fetchKey (messageId: string): Promise<void> {
	const response = await fetch(`/chat/message/${messageId}?stage=KEY`);
	if (response.status !== 200) return;
	const keyPortion = await response.text();
	const keyPair = loadKeypair(messageId);
	if (keyPair === undefined) throw new Error(`Keypair for ${messageId} was not saved!`);
	const dh = createDiffieHellman('secp256k1');
	dh.generateKeys(); // need to do this for some reason lol
	dh.setPublicKey(keyPair.publicKey, 'hex');
	dh.setPrivateKey(keyPair.privateKey, 'hex');

	const secret = dh.computeSecret(keyPortion.split('|')[1], 'hex');
	const queue = getMessageQueue();
	stopAwaitKey(messageId);
	if (queue.pendingMessage.has(messageId)) {
		const message = queue.pendingMessage.get(messageId) ?? '';
		let messageBytes = utils.utf8.toBytes(message);
		const iv = randomBytes(16);
		// eslint-disable-next-line new-cap
		const encryptor = new ModeOfOperation.cbc(secret, iv);
		while (messageBytes.length % 16 !== 0) messageBytes = new Uint8Array([...messageBytes, 0]);
		const encryptedMessageBytes = encryptor.encrypt(messageBytes);
		const payload = {
			messageId,
			userId: null,
			stage: 'MESSAGE',
			content: toHex(encryptedMessageBytes) + '|' + toHex(iv)
		};
		fetchWithCSRF('/chat', {
			method: 'POST',
			body: JSON.stringify(payload)
		}).then(async res => {
			if (res.status !== 200) {
				console.error(`MESSAGE message returned ${res.status}`);
			} else {
				dequeueMessage(messageId);
			}
		}).catch(e => {
			console.error(`MESSAGE message to ${messageId} failed: ${e as string}`);
		});
	} else {
		// Wait for CONTENT to be sent.
		await fetchContent(messageId);
	}
}

async function fetchContent (messageId: string): Promise<void> {
	const response = await fetch(`/chat/message/${messageId}?stage=KEY`);
	if (response.status !== 200) return;
	const keyPortion = await response.text();
	const keyPair = loadKeypair(messageId);
	if (keyPair === undefined) throw new Error(`Keypair for ${messageId} was not saved!`);
	const dh = createDiffieHellman('secp256k1');
	dh.generateKeys(); // need to do this for some reason lol
	dh.setPublicKey(keyPair.publicKey, 'hex');
	dh.setPrivateKey(keyPair.privateKey, 'hex');

	const secret = dh.computeSecret(keyPortion.split('|')[1], 'hex');
	const result = await fetch(`/chat/message/${messageId}?stage=MESSAGE`);
	if (result.status === 404) {
		return;
	} else if (result.status !== 200) {
		console.error(`Server returned ${result.status} to a MESSAGE chat request!`);
		return;
	}
	const serverText = await result.text();
	const [ciphertext, ivtext] = serverText.split('|');
	const iv = fromHex(ivtext);
	const cipher = fromHex(ciphertext);
	// eslint-disable-next-line new-cap
	const decryptor = new ModeOfOperation.cbc(secret, iv);
	const decryptedBytes = decryptor.decrypt(cipher);
	let contentEnd = decryptedBytes.length - 1;
	for (; contentEnd > 0; contentEnd--) {
		if (decryptedBytes[contentEnd] !== 0) break;
	}
	const trimmedBytes = decryptedBytes.subarray(0, contentEnd + 1);
	saveMessage(messageId, utils.utf8.fromBytes(trimmedBytes));
	const messageList = document.getElementById('messages');
	if (messageList !== null) location.reload(); // reload the chat page so the new messages are visible
}

async function respondToAnnounce (messageId: string): Promise<void> {
	const response = await fetch(`/chat/message/${messageId}?stage=ANNOUNCE`);
	if (response.status !== 200) return;
	sendKeyComponent(messageId);
}

function getMessage (messageId: string): string | null {
	const queue = getMessageQueue();
	const message = queue.decipheredMessages.get(messageId);
	if (message === undefined) {
		if (!queue.awaitingKey.includes(messageId)) {
			respondToAnnounce(messageId).catch(e => {
				console.error(`Error ocurred on responding to ANNOUNCE of ${messageId}: ${e as string}`);
			});
		}
		return null; // Please try again later
	} else {
		return message;
	}
}

function createSocketConnection (): void {
	const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
	console.log('help');
	socket.on('connect', () => {
		const authToken = getCookie('AuthToken');
		console.log(authToken);
		if (authToken === '') return;
		socket.emit('authenticate', authToken);
	});

	socket.on('messageAnnounce', (user: string, message: string) => {
		respondToAnnounce(message).catch((e: Error) => {
			console.log(`Failed to respond to ANNOUNCE for ${message}: ${e.message}`);
		});
	});

	socket.on('messageKey', (user: string, message: string) => {
		fetchKey(message).catch((e: Error) => {
			console.log(`Failed to respond to KEY for ${message}: ${e.message}`);
		});
	});

	socket.on('messageContent', (user: string, message: string) => {
		fetchContent(message).catch((e: Error) => {
			console.log(`Failed to respond to CONTENT for ${message}: ${e.message}`);
		});
	});
}

function trySendQueue (): void {
	const queue = getMessageQueue();
	queue.awaitingKey.forEach(async (v) => {
		await fetchKey(v);
	});
}

document.body.onload = () => {
	// setInterval(keepMessagesFresh, 500);
	createSocketConnection();
	trySendQueue();
	const messageList = document.getElementById('messages');
	const decryptTextElem = document.getElementById('decryptingText');
	if (messageList === null || decryptTextElem === null) return;
	for (const elem of messageList.children) {
		const messageId = elem.id.split('|')[0];
		const message = getMessage(messageId);
		for (const child of elem.children) {
			if (child.className === 'content') {
				(child as HTMLElement).innerText = message ?? decryptTextElem.innerText;
			}
		}
		if (message !== null) (elem as HTMLElement).hidden = false;
	}
};

function convertFormToJSON (form: JQuery<HTMLFormElement>): any {
	const array = form.serializeArray(); // Encodes the set of form elements as an array of names and values.
	const json: Record<string, string> = {};
	$.each(array, function () {
		json[this.name] = this.value;
	});
	return json;
}

$('#sendMessage').on('submit', async (e) => {
	e.preventDefault();
	const form = convertFormToJSON($('#sendMessage'));
	const recipientId = form.recipientId;
	const messageContent = form.messageContent;
	sendAnnounce(recipientId, messageContent);
	return false;
	// return false;
});
