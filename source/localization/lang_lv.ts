import type locale from './localization.js';

export default {
	header: {
		home_button: 'Sākums',
		publish_button: 'Veidot sludinājumu',
		search_button: 'Meklēt',
		page_title: 'EsEsElve',
		login_name: 'Ielogoties',
		signup_name: 'Reģistrējies',
		signout_name: 'Pamest reģistrāciju',
		current_lang: 'LV'
	},
	forms: {
		username_label: 'Lietotājvārds',
		username_or_email: 'Lietotājvārds vai epasts',
		email_label: 'Epasts',
		password_label: 'Parole'
	},
	listing_form: {
		image_upload_label: 'Pievieno attēlu, max 20MiB',
		listing_title: 'Sludinājuma virsraksts',
		listing_desc: 'Sludinājuma apraksts',
		start_price_label: 'Sākuma cena',
		auction_status_label: 'Vai ir izsole?',
		auction_end_label: 'Izsoles beidzas',
		category_select_label: 'Izvēlies sadaļu',
		category_def_val: 'Sadaļas izvēle',
		subcategory_select_label: 'Izvēlies apakšsadaļu',
		subcategory_def_val: 'Apakšsadaļas izvēle',
		update: 'Saglabāt rediģējumus',
		delete: 'Izdzēst',
		return: 'Atgriezties pie sludinājuma',
		add_listing: 'Pievienot sludinājumu',
		yes: 'Jā',
		no: 'Nē'
	},
	listing_item: {
		startprice: 'Sākotnējā cena',
		author: 'Autors',
		postdate: 'Izveidots',
		edit: 'Rediģēt',
		nopicture: 'Bilžu nav'
	},
	userpage: {
		welcome: 'Sveicināts/a'
	},
	chat: {
		send_message: 'Ievadiet ziņu:',
		awaiting_decrypt: 'Atšifrē ziņu, lūdzam uzgaidīt...',
		chat_with: 'Sarunājies ar'
	},
	admin: {
		add_sect: 'Pievienot sadaļu',
		return_sect: 'Atgriezties pie sadaļām',
		add_subsect: 'Pievienot apakšsadaļu',
		return_subsect: 'Atgriezties apakšsadaļā',
		update: 'Saglabāt rediģējumus',
		delete: 'Izdzēst',
		sec_name: 'Sadaļas nosaukums',
		lv_sec_name: 'Latviskais sadaļas nosaukums',
		subsec_name: 'Apakšsadaļas nosaukums',
		lv_subsec_name: 'Latviskais apakšsadaļas nosaukums',
		edit: 'Rediģēt',
		in_sect: 'Iekšā kategorijā - '
	},
	bid: {
		current_bid: 'Pašreiz solītā cena:',
		generatePlaceText: (arg0: string) => `Tavs solījums pašlaik ir ${arg0}. no visiem solījumiem.`,
		create: 'Pievienot solījumu',
		edit: 'Mainīt savu solījumu',
		bid_amount: 'Solītā cena:',
		update: 'Rediģēt solījumu',
		delete: 'Dzēst solījumu',
		bids: 'sola',
		bid_list: 'Solījumi:'
	},
	search: {
		searchfield: 'Ievadi atslēgvārdu',
		searchbutton: 'Meklēt'
	},
	listingfiltering: {
		price_asc: 'Augoša cena',
		price_desc: 'Dilstoša cena',
		oldest: 'Vecākais',
		newest: 'Jaunākais'
	}
} satisfies locale;
