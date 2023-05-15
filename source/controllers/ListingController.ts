import { Listing } from '../models/Listing.js';
import { Subsection } from '../models/Subsection.js';
import { User } from '../models/User.js';
import { Controller } from './BaseController.js';
import { headerConstants } from './config.js';
import { v4 as uuidv4 } from 'uuid';

const listing = new Controller('listing', [], ['subsectionId']);

listing.read = async (req, res) => {
	const subsecId = Number(req.params.subsectionId);
	if (!isNaN(subsecId)) {
		const subsection = await Subsection.findByPk(subsecId, { include: [Listing] });
		if (subsection !== null) {
			if (res.locals.user !== null && res.locals.user !== undefined) { // for header Login&sign up or username& sign out
				const user: User = res.locals.user;
				res.render('pages/main/all_listings.ejs', { subsection, subsecId, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/${user.id}` });
				return;
			} else {
				res.render('pages/main/all_listings.ejs', { subsection, subsecId, constants: headerConstants });
				return;
			}
		}
	}
	// TODO: proper redirect
	res.sendStatus(404);
};

interface ListingCreationForm {
	listing_name: string;
	listing_description: string;
	startprice: number;
	openstatus: string;
	subcatid: number;
};

function ValidListingCreationForm (obj: any): obj is ListingCreationForm {
	const valid =
		('startprice' in obj) && typeof obj.startprice === 'number' && obj.startprice > 0 && obj.startprice < 10_000 &&
		('listing_name' in obj) && typeof obj.listing_name === 'string' &&
		('listing_description' in obj) && typeof obj.listing_description === 'string' &&
		('subcatid' in obj) && typeof obj.subcatid === 'number' &&
		('openstatus' in obj) && typeof obj.openstatus === 'string';
	return valid;
};

listing.create = listing.handler(
	ValidListingCreationForm,
	async (req, res): Promise<void> => {
		try {
			if (await Subsection.findByPk(res.locals.subcatid) !== null) {
				if (res.locals.user !== null && res.locals.user !== undefined) {
					await Listing.create({
						id: uuidv4(),
						title: req.body.listing_name,
						body: req.body.listing_description,
						status: req.body.openstatus,
						start_price: req.body.startprice,
						userId: res.locals.user.id,
						subsectionId: req.body.subcatid
					});
				};
				res.redirect('/listing/' + String(req.body.subcatid));
			}
		} catch (error) {
			res.send(error);
		};
	}
);

listing.interface('/item', async (req, res) => {
	const listId = (req.query.listingId) as unknown;
	if ((listId) !== null && typeof listId === 'string') {
		const listing = await Listing.findByPk(listId, { include: [Subsection] });
		if (listing !== null) {
			if (res.locals.user !== null && res.locals.user !== undefined) {
				const user: User = res.locals.user;
				res.render('pages/main/listing_item.ejs', { title: listing.title, id: listing.id, body: listing.body, status: listing.status, subsecId: listing.subsectionId, startprice: listing.start_price, auctionend: listing.auction_end, userId: listing.userId, isAuction: listing.is_auction, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/${user.id}` });
			} else {
				res.render('pages/main/listing_item.ejs', { title: listing.title, id: listing.id, body: listing.body, status: listing.status, subsecId: listing.subsectionId, startprice: listing.start_price, auctionend: listing.auction_end, userId: listing.userId, isAuction: listing.is_auction, constants: headerConstants });
			}
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
});

listing.interface('/create', (req, res) => {
	if (res.locals.user instanceof User) {
		if (res.locals.user !== undefined && res.locals.user !== null) {
			const user: User = res.locals.user;
			res.render('pages/listing/create', { constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/${user.id}` });
		} else {
			res.render('pages/listing/create', { constants: headerConstants });
		}
	} else {
		res.redirect('/user/login?redirect=' + Buffer.from('/listing/create').toString('base64'));
	}
});
