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

// regenerates all images in the page
async function refreshImages (): Promise<void> {
	const display = $('#imgdisplay');
	display.empty();
	imageArray.forEach((file, index) => {
		const image = $('<div></div>');
		if (index !== 0) {
			$(
				`<button type="button" class="moveLeft">
					&lt;
				</button>
			`).appendTo(image).on('click', () => {
				swap(index, index - 1);
				void refreshImages();
			});
		}
		const subdiv = $('<div></div>').appendTo(image);
		subdiv.append(`<img src="${URL.createObjectURL(file)}">`);
		$(
			`<button type="button" class="deleteBtn">
				X
			</button>
		`).appendTo(subdiv).on('click', () => {
			erase(index);
			void refreshImages();
		});
		if (index !== imageArray.length - 1) {
			$(
				`<button type="button" class="moveRight">
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

// adds an image.
async function addImage (file: File): Promise<void> {
	if (file.size > 20_000_000) {
		alert('File is too large!');
	} else {
		imageArray.push(file);
		void refreshImages();
	}
}

$('#imgupload').on('change', () => {
	const upload = $('#imgupload')[0];
	if (upload instanceof HTMLInputElement) {
		if (upload.files !== null) {
			const f = upload.files[0];
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

function setErrs (errs: Map<string, string>): void {
	$('[id$=_err]').text('');
	errs.forEach((val, key) => {
		if (key.startsWith('err-')) {
			const id = key.substring('err-'.length) + '_err';
			$(`#${id}`).text(val);
		}
	});
}

$('#createForm').on('submit', async (e) => {
	e.preventDefault();
	const form: JQuery<HTMLFormElement> = $('#createForm');
	const formdata = convertFormToJSON(form);
	if (formdata.subcatid === 'defsub') {
		$('#subcatid_err').text('Please select category and subcategory');
		return;
	}
	const response = await fetchWithCSRF('/listing', {
		method: 'POST',
		body: JSON.stringify({ openstatus: 'closed', ...formdata })
	});
	const data = new FormData();
	imageArray.forEach(file => {
		data.append('image[]', file);
	});
	const respJSON = await response.json();
	if (respJSON.error !== undefined) {
		setErrs(new Map(Object.entries(respJSON)));
		return false;
	}
	data.append('listingId', respJSON.listingId);
	await fetchWithCSRFmultipart('/media', {
		method: 'POST',
		body: data
	}).then(Response => {
		location.href = Response.url;
	});
	return false;
});
