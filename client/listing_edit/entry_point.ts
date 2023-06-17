import './edit.scss';
import $ from 'jquery';
import { fetchWithCSRF } from '../hardening.js';
async function swapImages (a: number, b: number): Promise<void> {
	const listingId = $('body').data('listing-id');
	await fetchWithCSRF('/media', {
		method: 'PUT',
		body: JSON.stringify({ listingId, Anum: a, Bnum: b })
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
