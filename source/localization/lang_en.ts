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
		listing_title: 'Listing title',
		listing_desc: 'Listing description',
		start_price_label: 'Starting price',
		auction_status_label: 'Open the auction now?',
		category_select_label: 'Select a category',
		category_def_val: 'Category selection',
		subcategory_select_label: 'Select a subcategory',
		subcategory_def_val: 'Subcategory selection',
		update: 'Update',
		delete: 'Delete',
		return: 'Return to listing',
		add_listing: 'Create listing'
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
		awaiting_decrypt: 'Decrypting message, please wait...'
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
	}
} satisfies locale;
