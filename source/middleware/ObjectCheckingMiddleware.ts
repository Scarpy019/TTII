import { type Subsection, type Section, type User, type Listing } from '../models/index.js';

export function isLoggedOn (localuser: undefined | null | User): localuser is User { // Checks if given user isnt null or undefined, used in places to check if res.locals.user exists
	return localuser !== null && localuser !== undefined;
}

export function doesUserExist (user: undefined | null | User): user is User { // Code readibility and context wise this may be used but is identical to isLoggedOn
	return user !== null && user !== undefined;
}

// UserAccess has two admin level permissions (category_admin) and (ban_user)with bool data type which are checked for an user.
// If scalability is not a concern you can check against (access) with string data type
export function isAdmin (attemptinguser: User): boolean {
	if (attemptinguser.accesslevel.category_admin && attemptinguser.accesslevel.ban_user) {
		return true;
	} else {
		return false;
	}
}

// Checks if two users exist and are the same, used for comparing res.local.user and listing author
export function isUserAuthor (user: User | undefined | null, author: User | undefined | null): boolean {
	if (isLoggedOn(user) && doesUserExist(author)) {
		if (user.id === author.id) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

export function isCategory (category: Section | undefined | null): category is Section { // Checks if category isnt null or undefined
	return category !== null && category !== undefined;
}

export function isSubcategory (subcategory: Subsection | undefined | null): subcategory is Subsection { // Checks if subcategory isnt null or undefined
	return subcategory !== null && subcategory !== undefined;
}

export function isListing (listing: Listing | undefined | null): listing is Listing { // Checks if listing isnt null or undefined
	return listing !== null && listing !== undefined;
}
