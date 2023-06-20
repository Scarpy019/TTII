import type locale from './localization/localization.js';
import type { User } from './models';

declare global {
	namespace Express {
		interface Locals {
			/** Undefined before the authentification middleware is run, otherwise contains the user if they are logged in. */
			user?: User | null;
			/** Undefined before the session id middleware is run, otherwise contains the session id. */
			sessionId?: string;
			/** Undefined before the CSRF middleware is run, otherwise contains the CSRF token. */
			csrfToken?: string;

			// TODO: Link up lang to all Controller methods so TS knows lang is always there
			/** Undefined at root level only. */
			lang?: locale;
		}
	}

	// Socket.io types
	interface ServerToClientEvents {
		messageAnnounce: (user: string, message: string) => void;
		messageKey: (user: string, message: string) => void;
		messageContent: (user: string, message: string) => void;
	}

	interface ClientToServerEvents {
		authenticate: (token: string) => string; // Returns "Success" or an error reason
	}

	interface SocketData {
		userId: string | null;
	}
}
