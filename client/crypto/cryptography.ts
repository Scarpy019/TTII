// Some cryptography functions I could not be bothered to find a pure-JS alternative for

// Generates N amount of random bytes
export function randomBytes (amount: number): Uint8Array {
	return crypto.getRandomValues(new Uint8Array(amount));
}

// Converts bytes to a hex string representation
export function toHex (bytes: Uint8Array): string { // buffer is an ArrayBuffer
	return [...bytes]
		.map(x => x.toString(16).padStart(2, '0'))
		.join('');
}

// Reads a hex string byte representation into a byte array
export function fromHex (bytes: string): Uint8Array {
	const result = [];
	for (let i = 0; i < bytes.length; i += 2) {
		result.push(parseInt(bytes.substring(i, i + 2), 16));
	}
	return new Uint8Array(result);
}
