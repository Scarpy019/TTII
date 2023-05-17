function getCookie (cname: string): string {
	const name = cname + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}

// Inject CSRF into forms present within the document
const formsInDOM = [...document.getElementsByTagName('form')];
formsInDOM.forEach(form => {
	const input = document.createElement('input');
	input.name = '__CSRFToken';
	input.type = 'hidden';
	input.value = getCookie('CSRFToken');
	form.appendChild(input);
});

// Custom fetch request that injects the CSRF token into the body
export async function fetchWithCSRF (url: string, requestInit: RequestInit): Promise<Response> {
	const body = requestInit.body ?? {};
	const bodyWithCSRF = { ...body, __CSRFToken: getCookie('CSRFToken') };
	const headersWithJSON = { ...(requestInit.headers ?? {}), 'content-type': 'application/json' };
	return await fetch(url, {
		...requestInit,
		headers: headersWithJSON,
		body: JSON.stringify(bodyWithCSRF)
	});
}
