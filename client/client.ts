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
	const auctionEndDate = $('#auction_end_date').val();
	const auctionEndTime = $('#auction_end_time').val();
	const category = $('#categories').find(':selected').val();
	const subcategory = $('#subcategories').find(':selected').val();
	const currentlistingquery = location.search;
	const currentlisting = currentlistingquery.substring(4); // Currently removes ?id= from location search to leave the listing id
	if (listdesc !== undefined && startprice !== undefined && openstatus !== undefined && listtitle !== undefined && category !== undefined && subcategory !== undefined && currentlisting !== undefined) {
		const formobject = { listingid: currentlisting, listing_name: listtitle.toString(), listing_description: listdesc.toString(), startprice: startprice.toString(), openstatus: openstatus.toString(), auction_end_date: (auctionEndDate ?? 'N/A').toString(), auction_end_time: (auctionEndTime ?? 'N/A').toString(), subcatid: subcategory.toString() };
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
	const currentlistingquery = location.search;
	const currentlisting = currentlistingquery.substring(4);
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
	const sectionidquery = location.search;
	const sectionId = sectionidquery.substring(11); // Removes ?sectionId= from the location search
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
	const subsectionidquery = location.search;
	const subsectionId = subsectionidquery.substring(14); // Removes ?subsectionId= from the location search
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
		const currentlistingquery = location.search;
		const currentlisting = currentlistingquery.substring(4); // removes ?id= from location search
		await fetchWithCSRF('/listing/delete', {
			method: 'DELETE',
			body: JSON.stringify({ listingId: currentlisting })
		}).then(Response => {
			location.href = Response.url;
		});
	}
}

async function deleteSection (): Promise<void> {
	const currentSectionQuery = location.search;
	const currentSection = currentSectionQuery.substring(11); // Removes ?sectionId= from location search
	await fetchWithCSRF('/section/delete', {
		method: 'DELETE',
		body: JSON.stringify({ sectionId: currentSection })
	}).then(Response => {
		location.href = Response.url;
	});
}

async function deleteSubsection (): Promise<void> {
	const currentSubsectionQuery = location.search;
	const currentSubsection = currentSubsectionQuery.substring(14); // Removes ?subsectionId= from location search
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

async function editbid (): Promise<void> {
	const bidamount = $('#bid_amount').val();
	const listingid = $('#listing_id').val();
	if (bidamount !== undefined) {
		const formobject = { bid_amount: bidamount.toString(), listingid };
		await fetchWithCSRF('/bid', {
			method: 'PUT',
			body: JSON.stringify(formobject)
		}).then(Response => {
			location.href = Response.url;
		});
	}
}

$('#update_bid').on('click', editbid);

async function deletebid (): Promise<void> {
	const listingid = $('#listing_id').val();
	const formobject = { bid_amount: '1', listingid }; // Truly does not matter what I mark down as bid_amount here
	await fetchWithCSRF('/bid', {
		method: 'DELETE',
		body: JSON.stringify(formobject)
	}).then(Response => {
		location.href = Response.url;
	});
}

$('#delete_bid').on('click', deletebid);

function showHideAuctionInfo (): void {
	const checkbox = document.getElementById('open_status') as HTMLInputElement;
	const checkboxVal = checkbox.checked;
	const auctionDataDiv = $('#auction_info').get()[0];

	if (checkboxVal) {
		auctionDataDiv.hidden = false;
	} else {
		auctionDataDiv.hidden = true;
	}
}

$('#open_status').on('change', showHideAuctionInfo);

function listingsToArray (): any[] {
	const array: any[] = [];
	let i = 0;
	$('.listingitem').each(function () {
		const listitem = $('.listingitem')[i];
		const price = $(this).data('price');
		const date = $(this).data('date');
		array.push({ listitem, price, date });
		i++;
	});
	return array;
}

function listingSortPriceAsc (): void {
	const listings = listingsToArray();
	const temp = [1];
	let i = 0;
	while (i <= listings.length) {
		if (listings[i + 1] === undefined) {
			break;
		}
		if (listings[i].price > listings[i + 1].price) {
			temp[0] = listings[i + 1];
			listings[i + 1] = listings[i];
			listings[i] = temp[0];
			i = 0;
		} else {
			i++;
		}
	}
	i = 0;
	while (i < listings.length) {
		$('#subcategory_list').append(listings[i].listitem);
		i++;
	}
}

$('#price_asc').on('click', listingSortPriceAsc);

function listingSortPriceDesc (): void {
	const listings = listingsToArray();
	const temp = [1];
	let i = 0;
	while (i <= listings.length) {
		if (listings[i + 1] === undefined) {
			break;
		}
		if (listings[i].price < listings[i + 1].price) {
			temp[0] = listings[i + 1];
			listings[i + 1] = listings[i];
			listings[i] = temp[0];
			i = 0;
		} else {
			i++;
		}
	}
	i = 0;
	while (i < listings.length) {
		$('#subcategory_list').append($(listings[i].listitem));
		i++;
	}
}

function listingSortDateNewest (): void {
	const listings = listingsToArray();
	const temp = [1];
	let date1, date2;
	let i = 0;
	while (i < listings.length) {
		if (listings[i + 1] === undefined) {
			break;
		}
		date1 = new Date(listings[i].date);
		date2 = new Date(listings[i + 1].date);
		if ((date2.getTime()) > (date1.getTime())) {
			temp[0] = listings[i + 1];
			listings[i + 1] = listings[i];
			listings[i] = temp[0];
			i = 0;
		} else {
			i++;
		}
	}
	i = 0;
	while (i < listings.length) {
		$('#subcategory_list').append($(listings[i].listitem));
		i++;
	}
}

function listingSortDateOldest (): void {
	const listings = listingsToArray();
	const temp = [1];
	let date1, date2;
	let i = 0;
	while (i < listings.length) {
		if (listings[i + 1] === undefined) {
			break;
		}
		date1 = new Date(listings[i].date);
		date2 = new Date(listings[i + 1].date);
		if ((date2.getTime()) < (date1.getTime())) {
			temp[0] = listings[i + 1];
			listings[i + 1] = listings[i];
			listings[i] = temp[0];
			i = 0;
		} else {
			i++;
		}
	}
	i = 0;
	while (i < listings.length) {
		$('#subcategory_list').append($(listings[i].listitem));
		i++;
	}
}

$('#price_desc').on('click', listingSortPriceDesc);
$('#oldest').on('click', listingSortDateOldest);
$('#newest').on('click', listingSortDateNewest);

function searchforkeyword (keyword: string): void {
	location.href = `/search/result?keyword=${keyword}`;
}

$('#keyword_button').on('click', () => { searchforkeyword(String($('#keyword_search').val())); });
