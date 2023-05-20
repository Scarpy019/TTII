import $ from 'jquery';
import './image_input.scss';
import { fetchWithCSRF, fetchWithCSRFmultipart } from '../hardening.js';
import { logger } from '../../node_modules/yatsl/dist/index.js';

// const imageArray: File[] = [];

async function refreshImages (): Promise<void> {
	const response = await fetch('/media/draft-img', {
		method: 'GET'
	});
	if (response.ok) {
		const imgDisplay = $('#imgdisplay');
		imgDisplay.empty();
		imgDisplay.append(await response.text());
	}
}
void refreshImages();
async function addImage (file: File): Promise<void> {
	// const display = $('#imgdisplay');
	// display.append(`<img src="${URL.createObjectURL(file)}">`);
	// imageArray.push(file);
	const data = new FormData();
	data.append('image', file);
	const response = await fetchWithCSRFmultipart('/media', {
		method: 'POST',
		body: data
	});
	if (response.ok) {
		void refreshImages();
	} else {
		logger.log('Something went wrong...');
	}
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
		body: convertFormToJSON(form)
	});
	location.href = response.url;
	return false;
	// return false;
});
