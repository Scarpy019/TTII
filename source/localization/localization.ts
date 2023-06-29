export default interface locale {
	header: {
		home_button: string;
		search_button: string;
		publish_button: string;
		page_title: string;
		login_name: string;
		signup_name: string;
		signout_name: string;
		current_lang: string;
	};
	forms: {
		username_label: string;
		user_or_email: string;
		email_label: string;
		password_label: string;
	};
	listing_form: {
		image_upload_label: string;
		listing_title: string;
		listing_desc: string;
		start_price_label: string;
		auction_status_label: string;
		auction_end_label: string;
		category_select_label: string;
		category_def_val: string;
		subcategory_select_label: string;
		subcategory_def_val: string;
		update: string;
		delete: string;
		return: string;
		add_listing: string;
		yes: string;
		no: string;
	};
	listing_item: {
		startprice: string;
		author: string;
		postdate: string;
		edit: string;
	};
	userpage: {
		welcome: string;
	};
	chat: {
		send_message: string;
		awaiting_decrypt: string;
	};
	admin: {
		add_sect: string;
		return_sect: string;
		add_subsect: string;
		return_subsect: string;
		update: string;
		delete: string;
		sec_name: string;
		subsec_name: string;
		lv_sec_name: string;
		lv_subsec_name: string;
		edit: string;
		in_sect: string;
	};
	bid: {
		current_bid: string;
		generatePlaceText: (arg0: string) => string;
		create: string;
		edit: string;
		bid_amount: string;
		update: string;
		delete: string;
		bids: string;
	};
};
