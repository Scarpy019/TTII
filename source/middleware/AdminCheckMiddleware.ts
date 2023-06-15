import { type User } from '../models/index.js';

export function isLoggedOn (user: undefined | null | User): user is User {
	return user !== null && user !== undefined;
}

export function isAdmin (attemptinguser: User): boolean {
	if (attemptinguser.accesslevel.category_admin && attemptinguser.accesslevel.ban_user) {
		return true;
	} else {
		return false;
	}
}
