import type locale from './localization.js';

export default {
	header: {
		home_button: 'Sākums',
		publish_button: 'Veidot sludinājumu',
		search_button: 'Meklēt',
		page_title: 'Kkāda lapa',
		login_name: 'Ielogoties',
		signup_name: 'Reģistrējies',
		signout_name: 'Pamest reģistrāciju'
	},
	forms: {
		username_label: 'Lietotājvārds',
		user_or_email: 'Lietotājvārds vai epasts',
		email_label: 'Epasts',
		password_label: 'Parole'
	},
	listing_form: {
		listing_title: 'Sludinājuma virsraksts',
		listing_desc: 'Sludinājuma apraksts',
		start_price_label: 'Sākuma cena',
		auction_status_label: 'Vai pasludināt uzreiz?',
		category_select_label: 'Izvēlies sadaļu',
		category_def_val: 'Sadaļas izvēle',
		subcategory_select_label: 'Izvēlies apakšsadaļu',
		subcategory_def_val: 'Apakšsadaļas izvēle',
		update: 'Saglabāt rediģējumus',
		delete: 'Izdzēst',
		return: 'Atgriezties pie sludinājuma',
		add_listing: 'Pievienot sludinājumu'
	},
	listing_item: {
		startprice: 'Sākotnējā cena',
		author: 'Autors',
		postdate: 'Izveidots',
		edit: 'Rediģēt'
	},
	userpage: {
		welcome: 'Sveicināts'
	},
	admin: {
		add_sect: 'Pievienot sadaļu',
		return_sect: 'Atgriezties pie sadaļām',
		add_subsect: 'Pievienot apakšsadaļu',
		return_subsect: 'Atgriezties apakšsadaļā',
		update: 'Saglabāt rediģējumus',
		delete: 'Izdzēst',
		sec_name: 'Sadaļas nosaukums',
		subsec_name: 'Apakšsadaļas nosaukums',
		edit: 'Rediģēt',
		in_sect: 'Iekšā kategorijā - '
	}
} satisfies locale;
