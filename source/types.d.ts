import type { User } from './models';

declare global {
	namespace Express {
		interface Locals {
			/** Undefined before the authentification middleware is run, otherwise contains the user if they are logged in. */
			user?: User | null;
		}
	}
}
