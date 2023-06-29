import $ from 'jquery';
import { fetchWithCSRF } from './hardening.js';
import Cookies from 'js-cookie';

async function signout (): Promise<void> {
	await fetchWithCSRF('/signout', {
		method: 'DELETE',
		body: JSON.stringify('')
	}).then(Response => {
		location.href = Response.url;
	});
	location.reload();
}

$('#signoutbutton').on('click', signout);

async function banorUnbanUser (userid: any, newstatus: string): Promise<void> {
	if (userid !== null && userid !== undefined && typeof userid === 'string') {
		await fetchWithCSRF('/user/ban_or_unban', {
			method: 'PUT',
			body: JSON.stringify({ status: newstatus, targetuser: userid })
		}).then(Response => {
			location.href = Response.url;
		});
	}
}

$('#banbutton').on('click', () => { void banorUnbanUser($('#banbutton').val(), 'ban'); });
$('#unbanbutton').on('click', () => { void banorUnbanUser($('#unbanbutton').val(), 'unban'); });

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
	const currentlistingquery = new URLSearchParams(location.search);
	const currentlisting = currentlistingquery.get('id'); // Currently removes ?id= from location search to leave the listing id
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

$('#closelisting').on('click', () => { void editlistingstatus('closed'); });
$('#openlisting').on('click', () => { void editlistingstatus('open'); });

async function editlistingstatus (openstatus: any): Promise<void> {
	const currentlistingquery = new URLSearchParams(location.search);
	const currentlisting = currentlistingquery.get('id');
	if (openstatus === 'open' || openstatus === 'closed') {
		await fetchWithCSRF('/listing/statusupdate', {
			method: 'PUT',
			body: JSON.stringify({ listingid: currentlisting, newstatus: openstatus })
		}).then(Response => {
			location.href = Response.url;
		});
	}
}

async function editSection (): Promise<void> {
	const sectionTitle = $('#section_name').val();
	const LVsectionTitle = $('#lv_section_name').val();
	const sectionidquery = new URLSearchParams(location.search);
	const sectionId = sectionidquery.get('sectionId'); // Removes ?sectionId= from the location search
	if (sectionTitle !== null && sectionTitle !== undefined && sectionId !== null && sectionId !== undefined) {
		await fetchWithCSRF('/section/update', {
			method: 'PUT',
			body: JSON.stringify({ section_name: sectionTitle, section_id: sectionId, lv_section_name: LVsectionTitle })
		}).then(Response => {
			location.href = Response.url;
		});
	}
}

async function editSubsection (): Promise<void> {
	const subsectionTitle = $('#subsection_name').val();
	const sectionId = $('#sectionId').val();
	const LVsubsectionTitle = $('#lv_subsection_name').val();
	const subsectionidquery = new URLSearchParams(location.search);
	const subsectionId = subsectionidquery.get('subsectionId'); // Removes ?subsectionId= from the location search
	if (subsectionTitle !== null && subsectionTitle !== undefined && subsectionId !== null && subsectionId !== undefined && sectionId !== null && sectionId !== undefined) {
		await fetchWithCSRF('/subsection/update', {
			method: 'PUT',
			body: JSON.stringify({ subsection_name: subsectionTitle, subsection_id: subsectionId, section_id: sectionId, lv_subsection_name: LVsubsectionTitle })
		}).then(Response => {
			location.href = Response.url;
		});
	}
}

$('#updatebutton').on('click', editlisting);
$('#updatesection').on('click', editSection);
$('#updatesubsection').on('click', editSubsection);

async function deletelisting (): Promise<void> {
	if (confirm('Are you sure you wish to delete this? This cannot be undone.')) {
		const currentlistingquery = new URLSearchParams(location.search);
		const currentlisting = currentlistingquery.get('id'); // removes ?id= from location search
		await fetchWithCSRF('/listing/delete', {
			method: 'DELETE',
			body: JSON.stringify({ listingId: currentlisting })
		}).then(Response => {
			location.href = Response.url;
		});
	}
}

async function deleteSection (): Promise<void> {
	const currentSectionQuery = new URLSearchParams(location.search);
	const currentSection = currentSectionQuery.get('sectionId'); // Removes ?sectionId= from location search
	await fetchWithCSRF('/section/delete', {
		method: 'DELETE',
		body: JSON.stringify({ sectionId: currentSection })
	}).then(Response => {
		location.href = Response.url;
	});
}

async function deleteSubsection (): Promise<void> {
	const currentSubsectionQuery = new URLSearchParams(location.search);
	const currentSubsection = currentSubsectionQuery.get('subsectionId'); // Removes ?subsectionId= from location search
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
	const defopenstatus = $('#open_status_def').val();
	if (defopenstatus === 'open') {
		$('#open_status').prop('checked', true);
	} else if (defopenstatus === 'closed') {
		$('#open_status').prop('checked', false);
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
