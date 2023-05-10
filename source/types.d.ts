import type { User } from './models';

declare global {
	namespace Express {
		interface Locals {
			user: User | null;
		}
	}
}
