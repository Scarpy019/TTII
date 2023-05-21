import $ from 'jquery';
import { fetchWithCSRF } from './hardening.js';
import Cookies from 'js-cookie';

async function signout (): Promise<void> {
	const hacker = { hacker: 'hacker' };
	await fetchWithCSRF('/signout', {
		method: 'DELETE',
		body: JSON.stringify(hacker)
	});
	location.reload();
}

$('#signoutbutton').on('click', signout);

async function editlisting (): Promise<void> {
	const listtitle = $('#list_title').val();
	const listdesc = $('#list_desc').val();
	const startprice = $('#start_price').val();
	let openstatus;
	if ($('#open_status').is(':checked')) {
		openstatus = 'open';
	} else {
		openstatus = 'closed';
	}
	const category = $('#categories').find(':selected').val();
	const subcategory = $('#subcategories').find(':selected').val();
	const currentlistingquery = location.search;
	const currentlisting = currentlistingquery.substring(11);
	if (listdesc !== undefined && startprice !== undefined && openstatus !== undefined && listtitle !== undefined && category !== undefined && subcategory !== undefined && currentlisting !== undefined) {
		const formobject = { listingid: currentlisting, listing_name: listtitle.toString(), listing_description: listdesc.toString(), startprice: startprice.toString(), openstatus: openstatus.toString(), subcatid: subcategory.toString() };
		await fetchWithCSRF('/listing/update', {
			method: 'PUT',
			body: JSON.stringify(formobject)
		}).then(Response => {
			location.href = Response.url;
		});
	}
}

$('#updatebutton').on('click', editlisting);

async function deletelisting (): Promise<void> {
	await fetchWithCSRF('/listing/delete', {
		method: 'DELETE'
	});
}

$('#dangerousdeletebuttonthatdestroys').on('click', deletelisting);

$((document) => {
	const langcookie = Cookies.get('lang');
	if (langcookie !== undefined && langcookie !== null) {
		$('#language').val(langcookie);
	}
	if ($('#edit').val() === 'true') {
		const editcategory = $('#exist_cat').val();
		const editsubcategory = $('#exist_subcat').val();
		if (editcategory !== undefined && editcategory !== null && editsubcategory !== undefined && editsubcategory !== null) {
			$('#categories').val(editcategory.toString());
			$('#subcategories').val(editsubcategory.toString());
		}
	}
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
