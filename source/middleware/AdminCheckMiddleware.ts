import { type Subsection, type Section, type User, type Listing } from '../models/index.js';

export function isLoggedOn (localuser: undefined | null | User): localuser is User {
	return localuser !== null && localuser !== undefined;
}

export function doesUserExist (user: undefined | null | User): user is User { // Code readibility and context wise this may be used but is identical to isLoggedOn
	return user !== null && user !== undefined;
}

export function isAdmin (attemptinguser: User): boolean {
	if (attemptinguser.accesslevel.category_admin && attemptinguser.accesslevel.ban_user) {
		return true;
	} else {
		return false;
	}
}

export function isUserAuthor (user: User | undefined | null, author: User | undefined | null): boolean {
	if (isLoggedOn(user) && isLoggedOn(author)) {
		if (user.id === author.id) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

export function isCategory (category: Section | undefined | null): category is Section {
	return category !== null && category !== undefined;
}

export function isSubcategory (subcategory: Subsection | undefined | null): subcategory is Subsection {
	return subcategory !== null && subcategory !== undefined;
}

export function isListing (listing: Listing | undefined | null): listing is Listing {
	return listing !== null && listing !== undefined;
}
