import './edit.scss';
import $ from 'jquery';
import { fetchWithCSRF, fetchWithCSRFmultipart } from '../hardening.js';

async function swapImages (a: number, b: number): Promise<void> {
	const listingId = $('body').data('listing-id');
	await fetchWithCSRF('/media', {
		method: 'PUT',
		body: JSON.stringify({ listingId, Anum: a, Bnum: b })
	});
	location.reload();
}

async function removeImage (mediaId: string): Promise<void> {
	await fetchWithCSRF('/media', {
		method: 'DELETE',
		body: JSON.stringify({ mediaId })
	});
	location.reload();
}

$('.moveLeft').on('click', (e) => {
	e.preventDefault();
	const x: number = Number($(e.currentTarget).data('index'));
	void swapImages(x, x - 1);
});

$('.moveRight').on('click', (e) => {
	e.preventDefault();
	const x: number = Number($(e.currentTarget).data('index'));
	void swapImages(x, x + 1);
});

$('.deleteBtn').on('click', (e) => {
	e.preventDefault();
	const mediaId = $(e.currentTarget).data('mediaid');
	void removeImage(mediaId);
});

async function addImage (file: File): Promise<void> {
	if (file.size > 20_000_000) {
		alert('File is too large!');
		return;
	}
	const data = new FormData();
	data.append('image[]', file);
	const listingId = $('body').data('listing-id');
	data.append('listingId', listingId);
	await fetchWithCSRFmultipart('/media', {
		method: 'POST',
		body: data
	});
	location.reload();
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
