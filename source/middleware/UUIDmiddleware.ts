import { type UUID } from '../sequelizeSetup.js';

export function encodeUUID (id: UUID): string { // Removes all - from the uuid and converts it to base64 with - instead of + and _ instead of / for url safety
	const base64id = Buffer.from((id = (id.replace(/-/g, ''))), 'hex').toString('base64url');
	return base64id;
}

export function decodeUUID (id: string): string { // Reverse of encoding original UUID
	const hexconvertedID = Buffer.from(id, 'base64url').toString('hex');
	let newId = hexconvertedID.slice(0, 8) + '-' + hexconvertedID.slice(8);
	newId = newId.slice(0, 13) + '-' + newId.slice(13);
	newId = newId.slice(0, 18) + '-' + newId.slice(18);
	newId = newId.slice(0, 23) + '-' + newId.slice(23);
	return newId;
}
