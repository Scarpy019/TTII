import { getCookie } from './lib.js';

// Inject CSRF into forms present within the document
const CSRFDone = document.getElementById('__CSRFDone') !== null;
if (!CSRFDone) {
	const formsInDOM = [...document.getElementsByTagName('form')];
	formsInDOM.forEach(form => {
		const input = document.createElement('input');
		input.name = '__CSRFToken';
		input.type = 'hidden';
		input.value = getCookie('CSRFToken');
		form.appendChild(input);
	});
	const div = document.createElement('div');
	div.id = '__CSRFDone';
	div.hidden = true;
	document.body.appendChild(div);
}

// Custom fetch request that injects the CSRF token into the body
export async function fetchWithCSRF (url: string, requestInit: RequestInit): Promise<Response> {
	const body = requestInit.body as string ?? '{}';
	const tokenRaw: string | string[] = getCookie('CSRFToken');
	let token = '';
	if (Array.isArray(tokenRaw)) token = tokenRaw[tokenRaw.length - 1];
	else token = tokenRaw;
	const bodyWithCSRF = { ...JSON.parse(body), __CSRFToken: token };
	const headersWithJSON = { ...(requestInit.headers ?? {}), 'content-type': 'application/json', 'X-csrf': token };
	return await fetch(url, {
		...requestInit,
		headers: headersWithJSON,
		body: JSON.stringify(bodyWithCSRF)
	});
}

// Custom fetch request that injects the CSRF token into the body
export async function fetchWithCSRFmultipart (url: string, requestInit: RequestInit): Promise<Response> {
	const body = requestInit.body ?? null;
	const tokenRaw: string | string[] = getCookie('CSRFToken');
	let token = '';
	if (Array.isArray(tokenRaw)) token = tokenRaw[tokenRaw.length - 1];
	else token = tokenRaw;
	const headers = { ...(requestInit.headers ?? {}), 'X-csrf': token };
	return await fetch(url, {
		...requestInit,
		mode: 'cors',
		headers,
		body
	});
}
