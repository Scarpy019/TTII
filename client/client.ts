import $ from 'jquery';
import { fetchWithCSRF } from './hardening.js';
import Cookies from 'js-cookie';

async function signout (): Promise<void> {
	await fetchWithCSRF('/signout', {
		method: 'DELETE'
	});
	location.reload();
}

$('#signoutbutton').on('click', signout);

async function editlisting (): Promise<void> {
	await fetchWithCSRF('/listingupdate', {
		method: 'UPDATE'
	});
	location.reload();
	alert('Listing updated');
}

$('#updatebutton').on('click', editlisting);

$((document) => {
	const currentcat = $('#categories').find(':selected').val();
	const sectioncount = Number($('#sectioncount').val());
	let i;
	if (currentcat !== undefined && !Array.isArray(currentcat)) {
		for (i = 1; i <= sectioncount; i++) {
			$(`.category_${i}`).hide();
		}
		currentcat.toString();
		$(`.category_${currentcat}`).show();
	}
	if (currentcat === undefined) {
		for (i = 1; i <= sectioncount; i++) {
			$(`.category_${i}`).hide();
		}
	}
});

$('#categories').on('change', function () {
	const currentcat = ($('#categories').find(':selected').val());
	const sectioncount = Number($('#sectioncount').val());
	let i;
	if (currentcat !== undefined && !Array.isArray(currentcat)) {
		for (i = 1; i <= sectioncount; i++) {
			$(`.category_${i}`).hide();
		}
		$('#subcategories').val('defsub');
		currentcat.toString();
		$(`.category_${currentcat}`).show();
	}
});

$('#language').on('change', function () {
	const currentlang = ($('#language').find(':selected').text());
	Cookies.set('lang', currentlang);
	location.reload();
});
