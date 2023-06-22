import $ from 'jquery';
import { fetchWithCSRF } from './hardening.js';
import Cookies from 'js-cookie';

async function signout (): Promise<void> {
	await fetchWithCSRF('/signout', {
		method: 'DELETE',
		body: JSON.stringify('')
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

async function editSection (): Promise<void> {
	const sectionTitle = $('#section_name').val();
	const sectionidquery = location.search;
	const sectionId = sectionidquery.substring(11);
	if (sectionTitle !== null && sectionTitle !== undefined && sectionId !== null && sectionId !== undefined) {
		await fetchWithCSRF('/section/update', {
			method: 'PUT',
			body: JSON.stringify({ section_name: sectionTitle, section_id: sectionId })
		}).then(Response => {
			location.href = Response.url;
		});
	}
}

async function editSubsection (): Promise<void> {
	const subsectionTitle = $('#subsection_name').val();
	const sectionId = $('#sectionId').val();
	const subsectionidquery = location.search;
	const subsectionId = subsectionidquery.substring(14);
	if (subsectionTitle !== null && subsectionTitle !== undefined && subsectionId !== null && subsectionId !== undefined && sectionId !== null && sectionId !== undefined) {
		await fetchWithCSRF('/subsection/update', {
			method: 'PUT',
			body: JSON.stringify({ subsection_name: subsectionTitle, subsection_id: subsectionId, section_id: sectionId })
		}).then(Response => {
			location.href = Response.url;
		});
	}
}

$('#updatebutton').on('click', editlisting);
$('#updatesection').on('click', editSection);
$('#updatesubsection').on('click', editSubsection);

async function deletelisting (): Promise<void> {
	const currentlistingquery = location.search;
	const currentlisting = currentlistingquery.substring(11);
	await fetchWithCSRF('/listing/delete', {
		method: 'DELETE',
		body: JSON.stringify({ listingId: currentlisting })
	}).then(Response => {
		location.href = Response.url;
	});
}

async function deleteSection (): Promise<void> {
	const currentSectionQuery = location.search;
	const currentSection = currentSectionQuery.substring(11);
	await fetchWithCSRF('/section/delete', {
		method: 'DELETE',
		body: JSON.stringify({ sectionId: currentSection })
	}).then(Response => {
		location.href = Response.url;
	});
}

async function deleteSubsection (): Promise<void> {
	const currentSubsectionQuery = location.search;
	const currentSubsection = currentSubsectionQuery.substring(14);
	await fetchWithCSRF('/subsection/delete', {
		method: 'DELETE',
		body: JSON.stringify({ subsec_id: currentSubsection })
	}).then(Response => {
		location.href = Response.url;
	});
}

$('#dangerousdeletebuttonthatdestroys').on('click', deletelisting);
$('#delete_section').on('click', deleteSection);
$('#delete_subsection').on('click', deleteSubsection);

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
	if ($('#createfromexistsubcat').val() === 'true') {
		const oldcategory = $('#oldcategory').val();
		const oldsubcategory = $('#oldsubcategory').val();
		if (oldcategory !== undefined && oldcategory !== null && oldsubcategory !== undefined && oldsubcategory !== null) {
			$('#categories').val(oldcategory.toString());
			$('#subcategories').val(oldsubcategory.toString());
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
