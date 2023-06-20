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
// Object that contains a dictionary of message IDs and keypairs that correspond to them.
interface CodeBook {
	messageKeypair: Map<string, Keypair>;
};
// Message queue object, tracks messages awaiting key from other user, messages pending encryption and messages that have been decrypted
interface MessageQueue {
	awaitingKey: string[];
	pendingMessage: Map<string, string>; // MessageID, content
	decipheredMessages: Map<string, string>; // MessageID, content
}

// Gets the user id from a hidden field in DOM
function getUser (): string {
	return $('#user_id')[0].innerText;
}

// Function to convert Map into JSON
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

// Function to convert JSON into map
function reviver (key: any, value: any): any {
	if (typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
			return new Map(value.value);
		}
	}
	return value;
}

// Obtains the codebook object from local storage
function getCodebook (): CodeBook {
	const userId = getUser();
	const codebookString = localStorage.getItem(userId + '-keys');
	if (codebookString === null) {
		// If no codebook has been saved, make a new one
		const codebook: CodeBook = {
			messageKeypair: new Map<string, Keypair>()
		};
		return codebook;
	} else {
		const codebook: CodeBook = JSON.parse(codebookString, reviver);
		return codebook;
	}
}

// Obtains the message queue from local storage
function getMessageQueue (): MessageQueue {
	const userId = getUser();
	const queueString = localStorage.getItem(userId + '-queue');
	if (queueString === null) {
		// If no queue exists, make a new one
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

// Enqueues a message in the message queue
function queueMessage (messageId: string, messageContent: string): void {
	const queue = getMessageQueue();
	queue.pendingMessage.set(messageId, messageContent);
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));
}

// Dequeues a message in the message queue
function dequeueMessage (messageId: string): void {
	const queue = getMessageQueue();
	queue.pendingMessage.delete(messageId);
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));

	const messageList = document.getElementById('messages');
	if (messageList !== null) location.reload(); // reload the chat page so the new messages are visible
}

// Marks down a message as awaiting key
function awaitKey (messageId: string): void {
	const queue = getMessageQueue();
	queue.awaitingKey.push(messageId);
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));
}

// Resolves a message awaiting key
function stopAwaitKey (messageId: string): void {
	const queue = getMessageQueue();
	const index = queue.awaitingKey.indexOf(messageId);
	if (index > -1) {
		// if a message is found in the awaiting key array, remove it
		queue.awaitingKey.splice(index, 1);
	}
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));
}

// Saves a deciphered message
function saveMessage (messageId: string, messageContent: string): void {
	const queue = getMessageQueue();
	queue.decipheredMessages.set(messageId, messageContent);
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));
}

// Saves a keypair in the codebook
function saveKeypair (messageId: string, publicKey: string, privateKey: string): void {
	const codebook = getCodebook();
	codebook.messageKeypair.set(messageId, { publicKey, privateKey });
	localStorage.setItem(getUser() + '-keys', JSON.stringify(codebook, replacer));
}

// Retrieves a keypair from the codebook
function loadKeypair (messageId: string): Keypair | undefined {
	const codebook = getCodebook();
	return codebook.messageKeypair.get(messageId);
}

// Sends the ANNOUNCE chat message component to server
function sendAnnounce (recipientId: string, messageContent: string): void {
	const payload = {
		messageId: null,
		userId: recipientId,
		stage: 'ANNOUNCE',
		content: 'a|b' // Used to specify common values for Diffie-Hellman, now useless due to ECDH. Easier to leave it with a dummy value
	};
	fetchWithCSRF('/chat', {
		method: 'POST',
		body: JSON.stringify(payload)
	}).then(async res => {
		if (res.status !== 200) {
			console.error(`ANNOUNCE message returned ${res.status}`);
		} else {
			if (res.body !== null) {
				// Success, we can queue the message, send out public key and wait for the other side to send theirs
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

// Sends the client's public key to the server
function sendKeyComponent (messageId: string): void {
	const user = getUser();
	const dh = createDiffieHellman('secp256k1'); // Create a ECDH algorithm instance, the specific curve does not really matter, secp256k1 is good enough.
	const preexistingKey = loadKeypair(messageId); // Check whether a keypair has already been generated (otherwise we might accidentally discard the working key)
	if (preexistingKey !== undefined) {
		awaitKey(messageId); // Mark down the message as awaiting key, since it seems to not have been marked as one already
		return;
	}
	dh.generateKeys(); // Generate a keypair
	const keycomp = dh.getPublicKey('hex') as string; // Prepare the public key as a hex string.
	saveKeypair(messageId, keycomp, dh.getPrivateKey('hex') as string); // Save both keys for later usage
	const payload = {
		messageId,
		userId: null,
		stage: 'KEY',
		content: user + '|' + keycomp // Sender ID | Public Key
	};
	fetchWithCSRF('/chat', {
		method: 'POST',
		body: JSON.stringify(payload)
	}).then(async res => {
		if (res.status !== 200) {
			console.error(`KEY message returned ${res.status}`);
		} else {
			// If successful, await key from other side
			awaitKey(messageId);
		}
	}).catch(e => {
		console.error(`KEY message to ${messageId} failed: ${e as string}`);
	});
}

// Retrieves the other user's public key from the server
async function fetchKey (messageId: string): Promise<void> {
	const response = await fetch(`/chat/message/${messageId}?stage=KEY`);
	if (response.status !== 200) return; // Key is not ready, we need to wait
	const keyPortion = await response.text(); // Save the key returned by the server
	const keyPair = loadKeypair(messageId); // Load our keypair
	if (keyPair === undefined) throw new Error(`Keypair for ${messageId} was not saved!`);
	const dh = createDiffieHellman('secp256k1'); // Instantiate ECDH
	dh.generateKeys(); // need to do this for some reason lol
	// Load the keys into the algorithm
	dh.setPublicKey(keyPair.publicKey, 'hex');
	dh.setPrivateKey(keyPair.privateKey, 'hex');

	const secret = dh.computeSecret(keyPortion.split('|')[1], 'hex'); // Compute the secret using our keys and the public key of the other user
	const queue = getMessageQueue();
	stopAwaitKey(messageId); // We have successfully obtained the other public key, we can stop waiting
	if (queue.pendingMessage.has(messageId)) {
		// We are waiting on sending the message - we have all we need to do that now!
		const message = queue.pendingMessage.get(messageId) ?? '';
		let messageBytes = utils.utf8.toBytes(message); // Convert the message to bytes, preparing it for AES encryption
		const iv = randomBytes(16); // Generate 16 random bytes as the intialisation vector for AES
		// \/ need to do this as the library apparently does not abide by eslint standards :(
		// eslint-disable-next-line new-cap
		const encryptor = new ModeOfOperation.cbc(secret, iv); // Instantiate AES-CBC with the shared secret generated using ECDH
		while (messageBytes.length % 16 !== 0) messageBytes = new Uint8Array([...messageBytes, 0]); // Pad the message with null bytes so it is suitable for AES (AES requires the input message to consist of 16-byte long blocks)
		const encryptedMessageBytes = encryptor.encrypt(messageBytes); // Encrypt the message using AES-CBC encryption algorithm
		const payload = {
			messageId,
			userId: null,
			stage: 'MESSAGE',
			content: toHex(encryptedMessageBytes) + '|' + toHex(iv) // Encrypted Message | Initialisation Vector
		};
		// Send the encrypted message to the server, along with the IV so the other user can decrypt it
		fetchWithCSRF('/chat', {
			method: 'POST',
			body: JSON.stringify(payload)
		}).then(async res => {
			if (res.status !== 200) {
				console.error(`MESSAGE message returned ${res.status}`);
			} else {
				// Success, we can dequeue the message and move on
				dequeueMessage(messageId);
			}
		}).catch(e => {
			console.error(`MESSAGE message to ${messageId} failed: ${e as string}`);
		});
	} else {
		// Wait for CONTENT to be sent.
		await fetchContent(messageId); // Just in case, though, check whether CONTENT has already been sent
	}
}

// Fetches CONTENT component from the server (which contains the encrypted message)
async function fetchContent (messageId: string): Promise<void> {
	// Obtain the key first (which should exist, provided CONTENT has been sent)
	const response = await fetch(`/chat/message/${messageId}?stage=KEY`);
	if (response.status !== 200) return; // Key is not ready, we need to wait
	const keyPortion = await response.text(); // Save the key returned by the server
	const keyPair = loadKeypair(messageId); // Load our keypair
	if (keyPair === undefined) throw new Error(`Keypair for ${messageId} was not saved!`);
	const dh = createDiffieHellman('secp256k1'); // Instantiate ECDH
	dh.generateKeys(); // need to do this for some reason lol
	// Load the keys into the algorithm
	dh.setPublicKey(keyPair.publicKey, 'hex');
	dh.setPrivateKey(keyPair.privateKey, 'hex');

	const secret = dh.computeSecret(keyPortion.split('|')[1], 'hex'); // Compute the secret using our keys and the public key of the other user
	const result = await fetch(`/chat/message/${messageId}?stage=MESSAGE`);
	if (result.status === 404) {
		// MESSAGE does not exist, we need to wait
		return;
	} else if (result.status !== 200) {
		// If there's a different status code, that means something went wrong
		console.error(`Server returned ${result.status} to a MESSAGE chat request!`);
		return;
	}
	const serverText = await result.text(); // Obtain the text returned by the server
	const [ciphertext, ivtext] = serverText.split('|'); // Load the ciphertext hex string and IV hex string
	const iv = fromHex(ivtext); // Convert the IV hex bytes into actual bytes
	const cipher = fromHex(ciphertext); // Likewise for the cipher text
	// \/ need to do this as the library apparently does not abide by eslint standards :(
	// eslint-disable-next-line new-cap
	const decryptor = new ModeOfOperation.cbc(secret, iv); // Instantiate the decryptor
	const decryptedBytes = decryptor.decrypt(cipher); // Decrypt the ciphertext bytes
	// Figure out the actual end of the decrypted text (as in, the point where padding ends)
	let contentEnd = decryptedBytes.length - 1;
	for (; contentEnd > 0; contentEnd--) {
		if (decryptedBytes[contentEnd] !== 0) break; // Once we find a bit that is not 0, we have found the end of actual content
	}
	const trimmedBytes = decryptedBytes.subarray(0, contentEnd + 1); // Trim the null bytes as they are unnecessary
	saveMessage(messageId, utils.utf8.fromBytes(trimmedBytes)); // Save the decrypted message into local storage so we do not have to repeatedly decrypt it later on
	const messageList = document.getElementById('messages');
	if (messageList !== null) location.reload(); // reload the chat page so the new messages are visible, if we are on the chat page
}

// Responds to ANNOUNCE event from server
async function respondToAnnounce (messageId: string): Promise<void> {
	const response = await fetch(`/chat/message/${messageId}?stage=ANNOUNCE`);
	if (response.status !== 200) return; // Double-check that we have an ANNOUNCE
	sendKeyComponent(messageId); // Send our public key for this message
}

// Gets the message if decrypted, alternatively tries to decrypt it
function getMessage (messageId: string): string | null {
	const queue = getMessageQueue();
	const message = queue.decipheredMessages.get(messageId);
	if (message === undefined) {
		// Message has not been decrypted, time to try to decrypt it
		if (!queue.awaitingKey.includes(messageId)) { // If we are not waiting for it to get decrypted, we should begin the decryption process
			respondToAnnounce(messageId).catch(e => {
				console.error(`Error ocurred on responding to ANNOUNCE of ${messageId}: ${e as string}`);
			});
		}
		return null; // Please try again later
	} else {
		return message;
	}
}

// Creates a Socket.IO socket and binds handlers for events
function createSocketConnection (): void {
	const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
	socket.on('connect', () => {
		// On connection, attempt to authenticate as the user
		const authToken = getCookie('AuthToken');
		if (authToken === '') return;
		socket.emit('authenticate', authToken);
	});

	socket.on('messageAnnounce', (user: string, message: string) => {
		// On ANNOUNCE, call the respective handler for the message
		respondToAnnounce(message).catch((e: Error) => {
			console.error(`Failed to respond to ANNOUNCE for ${message}: ${e.message}`);
		});
	});

	socket.on('messageKey', (user: string, message: string) => {
		// On KEY, call fetchKey for the message in order to begin the encryption/decryption of the actual message
		fetchKey(message).catch((e: Error) => {
			console.error(`Failed to respond to KEY for ${message}: ${e.message}`);
		});
	});

	socket.on('messageContent', (user: string, message: string) => {
		// On MESSAGE, call fetchContent to retrieve the encrypted message and decrypt it
		fetchContent(message).catch((e: Error) => {
			console.error(`Failed to respond to CONTENT for ${message}: ${e.message}`);
		});
	});
}

// Try to send queued messages
function trySendQueue (): void {
	const queue = getMessageQueue();
	queue.awaitingKey.forEach(async (v) => {
		await fetchKey(v); // For each queued message, try to obtain the key
	});
}

// On load, create socket connection, try to send the queued messages and (if on the chat UI) decrypt sent messages
document.body.onload = () => {
	// setInterval(keepMessagesFresh, 500);
	createSocketConnection(); // Spawn a socket.io socket
	trySendQueue(); // Try to send queued messages, in case if the other client has sent the keys while away
	const messageList = document.getElementById('messages');
	const decryptTextElem = document.getElementById('decryptingText');
	if (messageList === null || decryptTextElem === null) return; // If these are not undefined, we are on the chat UI
	for (const elem of messageList.children) {
		// Attempt to get each individual message from local cache and display them to the user
		const messageId = elem.id.split('|')[0];
		const message = getMessage(messageId);
		for (const child of elem.children) {
			if (child.className === 'content') {
				(child as HTMLElement).innerText = message ?? decryptTextElem.innerText;
			}
		}
		if (message !== null) (elem as HTMLElement).hidden = false; // If the message was successfully decrypted, unhide it
	}
};

// Converts form into JSON
function convertFormToJSON (form: JQuery<HTMLFormElement>): any {
	const array = form.serializeArray(); // Encodes the set of form elements as an array of names and values.
	const json: Record<string, string> = {};
	$.each(array, function () {
		json[this.name] = this.value;
	});
	return json;
}

$('#sendMessage').on('submit', async (e) => {
	// On message sent, read the recipient and message content, and send ANNOUNCE to the server announcing that a new message is waiting to be sent
	e.preventDefault();
	const form = convertFormToJSON($('#sendMessage'));
	const recipientId = form.recipientId;
	const messageContent = form.messageContent;
	sendAnnounce(recipientId, messageContent);
	return false;
	// return false;
});
