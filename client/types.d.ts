declare module 'create-ecdh';

// Socket.io types
interface ServerToClientEvents {
	messageAnnounce: (user: string, message: string) => void;
	messageKey: (user: string, message: string) => void;
	messageContent: (user: string, message: string) => void;
}

interface ClientToServerEvents {
	authenticate: (token: string) => string; // Returns "Success" or an error reason
}
