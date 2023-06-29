import $ from 'jquery';

/**
 * Useful functions for various client-side logic.
 */
// import $ from 'jquery';

// Gets the specified cookie from document.cookie
export function getCookie (cname: string): string {
	const name = cname + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}

/**
 * LocalStorage Management
 */
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
export function getUser (): string {
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
export function getCodebook (): CodeBook {
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

// Saves the codebook object in local storage
function setCodebook (codebook: CodeBook): void {
	localStorage.setItem(getUser() + '-keys', JSON.stringify(codebook, replacer));
}

// Obtains the message queue from local storage
export function getMessageQueue (): MessageQueue {
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

// Saves the message queue object in local storage
function setMessageQueue (queue: MessageQueue): void {
	localStorage.setItem(getUser() + '-queue', JSON.stringify(queue, replacer));
}

// Enqueues a message in the message queue
export function queueMessage (messageId: string, messageContent: string): void {
	const queue = getMessageQueue();
	queue.pendingMessage.set(messageId, messageContent);
	setMessageQueue(queue);
}

// Dequeues a message in the message queue
export function dequeueMessage (messageId: string): void {
	const queue = getMessageQueue();
	queue.pendingMessage.delete(messageId);
	setMessageQueue(queue);

	const messageList = document.getElementById('messages');
	if (messageList !== null) location.reload(); // reload the chat page so the new messages are visible
}

// Marks down a message as awaiting key
export function awaitKey (messageId: string): void {
	const queue = getMessageQueue();
	queue.awaitingKey.push(messageId);
	setMessageQueue(queue);
}

// Resolves a message awaiting key
export function stopAwaitKey (messageId: string): void {
	const queue = getMessageQueue();
	const index = queue.awaitingKey.indexOf(messageId);
	if (index > -1) {
		// if a message is found in the awaiting key array, remove it
		queue.awaitingKey.splice(index, 1);
	}
	setMessageQueue(queue);
}

// Saves a deciphered message
export function saveMessage (messageId: string, messageContent: string): void {
	const queue = getMessageQueue();
	queue.decipheredMessages.set(messageId, messageContent);
	setMessageQueue(queue);
}

// Saves a keypair in the codebook
export function saveKeypair (messageId: string, publicKey: string, privateKey: string): void {
	const codebook = getCodebook();
	codebook.messageKeypair.set(messageId, { publicKey, privateKey });
	setCodebook(codebook);
}

// Retrieves a keypair from the codebook
export function loadKeypair (messageId: string): Keypair | undefined {
	const codebook = getCodebook();
	return codebook.messageKeypair.get(messageId);
}
