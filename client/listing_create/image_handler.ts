import $ from 'jquery';
import './image_input.scss';
import { fetchWithCSRF, fetchWithCSRFmultipart } from '../hardening.js';

const imageArray: File[] = [];

function swap (a: number, b: number): void {
	const temp = imageArray[a];
	imageArray[a] = imageArray[b];
	imageArray[b] = temp;
}

function erase (a: number): void {
	imageArray.splice(a, 1);
}

async function refreshImages (): Promise<void> {
	/* const response = await fetch('/media/draft-img', {
		method: 'GET'
	});
	if (response.ok) {
		const imgDisplay = $('#imgdisplay');
		imgDisplay.empty();
		imgDisplay.append(await response.text());
	} */

	const display = $('#imgdisplay');
	display.empty();
	imageArray.forEach((file, index) => {
		const image = $('<div></div>');
		if (index !== 0) {
			$(
				`<button type="button">
					&lt;
				</button>
			`).appendTo(image).on('click', () => {
				swap(index, index - 1);
				void refreshImages();
			});
		}
		$(
			`<button type="button">
				X
			</button>
		`).appendTo(image).on('click', () => {
			erase(index);
			void refreshImages();
		});
		image.append(`<img src="${URL.createObjectURL(file)}">`);
		if (index !== imageArray.length - 1) {
			$(
				`<button type="button">
					&gt;
				</button>
			`).appendTo(image).on('click', () => {
				swap(index, index + 1);
				void refreshImages();
			});
		}
		image.appendTo(display);
	});
}
void refreshImages();
async function addImage (file: File): Promise<void> {
	if (file.size > 20_000_000) {
		alert('File is too large!');
	} else {
		imageArray.push(file);
		void refreshImages();
	}
	/* const data = new FormData();
	data.append('image', file);
	const response = await fetchWithCSRFmultipart('/media', {
		method: 'POST',
		body: data
	});
	if (response.ok) {
		void refreshImages();
	} else {
		console.log('Something went wrong...');
	} */
}

$('#imgupload').on('change', () => {
	const upload = $('#imgupload')[0];
	if (upload instanceof HTMLInputElement) {
		if (upload.files !== null) {
			const f = upload.files[0];
			console.log(f);
			void addImage(f);
			$('#imgupload').val('');
		}
	}
});

function convertFormToJSON (form: JQuery<HTMLFormElement>): any {
	const array = form.serializeArray(); // Encodes the set of form elements as an array of names and values.
	const json: Record<string, string> = {};
	$.each(array, function () {
		json[this.name] = this.value;
	});
	return json;
}

$('#createForm').on('submit', async (e) => {
	e.preventDefault();
	const form: JQuery<HTMLFormElement> = $('#createForm');
	const response = await fetchWithCSRF('/listing', {
		method: 'POST',
		body: JSON.stringify({ openstatus: 'closed', ...convertFormToJSON(form) })
	});
	const data = new FormData();
	imageArray.forEach(file => {
		data.append('image[]', file);
	});
	const respJSON = await response.json();
	data.append('listingId', respJSON.listingId);
	await fetchWithCSRFmultipart('/media', {
		method: 'POST',
		body: data
	}).then(Response => {
		location.href = Response.url;
	});
	return false;
});
