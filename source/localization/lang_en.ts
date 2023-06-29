import type locale from './localization.js';

export default {
	header: {
		home_button: 'Home',
		publish_button: 'Create listing',
		search_button: 'Search',
		page_title: 'Generic page title',
		login_name: 'Login',
		signup_name: 'Sign up',
		signout_name: 'Log out',
		current_lang: 'ENG'
	},
	forms: {
		username_label: 'Username',
		user_or_email: 'Username or email',
		email_label: 'Email',
		password_label: 'Password'
	},
	listing_form: {
		image_upload_label: 'Add image, max 20MiB',
		listing_title: 'Listing title',
		listing_desc: 'Listing description',
		start_price_label: 'Starting price',
		auction_status_label: 'Is an auction?',
		auction_end_label: 'Auction ends',
		category_select_label: 'Select a category',
		category_def_val: 'Category selection',
		subcategory_select_label: 'Select a subcategory',
		subcategory_def_val: 'Subcategory selection',
		update: 'Update',
		delete: 'Delete',
		return: 'Return to listing',
		add_listing: 'Create listing',
		yes: 'Yes',
		no: 'No'
	},
	listing_item: {
		startprice: 'Starting price',
		author: 'Author',
		postdate: 'Posted on',
		edit: 'Edit'
	},
	userpage: {
		welcome: 'Welcome'
	},
	chat: {
		send_message: 'Enter message:',
		awaiting_decrypt: 'Decrypting message, please wait...',
		chat_with: "Chat with"
	},
	admin: {
		add_sect: 'Add section',
		return_sect: 'Return to sections',
		add_subsect: 'Add subsection',
		return_subsect: 'Return to subsection',
		update: 'Update',
		delete: 'Delete',
		sec_name: 'Section name',
		lv_sec_name: 'Latvian section name',
		subsec_name: 'Subsection name',
		lv_subsec_name: 'Latvian subsection name',
		edit: 'Edit',
		in_sect: 'In section - '
	},
	bid: {
		current_bid: "Current bid:",
		generatePlaceText: (arg0: string) => `Your bid is currently ${arg0}. of all bids.`,
		create: "Add a bid",
		edit: "Edit your bid",
		bid_amount: "Bid amount:",
		update: "Update Bid",
		delete: "Delete Bid",
		bids: "bids"
	}
} satisfies locale;
