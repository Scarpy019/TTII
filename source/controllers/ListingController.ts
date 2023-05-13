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
			if (res.locals.user !== null && res.locals.user !== undefined) {
				res.render('pages/tt2_listings.ejs', { subsection, subsecId, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: '/user/' + res.locals.user.id, signup_out_redirect: '/user/signout', signup_out_name: 'Sign Out' });
				return;
			} else {
				res.render('pages/tt2_listings.ejs', { subsection, subsecId, constants: headerConstants, userstatus_name: 'Login', userstatus_page: '/user/login', signup_out_redirect: '/user/signup', signup_out_name: 'Sign Up' });
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
	catid: number;
	subcatid: number;
	id: string;
};

function ValidListingCreationForm (obj: any): obj is ListingCreationForm {
	const valid =
		('startprice' in obj) && ('listing_name' in obj) && ('listing_description' in obj) && ('openstatus' in obj);
	return valid;
};

listing.create = listing.handler(
	ValidListingCreationForm,
	async (req, res): Promise<void> => {
		try {
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
		} catch (error) {
			res.send(error);
		};
	}
);

const listingItem = new Controller('subcategory', ['subsectionId'], ['listingId']);

listingItem.read = async (req, res) => {
	const listId = (req.params.listingId);
	if ((listId) !== null) {
		const listing = await Listing.findByPk(listId, { include: [Subsection] });
		if (listing !== null) {
			if (res.locals.user !== null && res.locals.user !== undefined) {
				res.render('pages/tt2_listing_page.ejs', { title: listing.title, id: listing.id, body: listing.body, status: listing.status, subsecId: listing.subsectionId, startprice: listing.start_price, auctionend: listing.auction_end, userId: listing.userId, isAuction: listing.is_auction, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: '/user/' + res.locals.user.id, signup_out_redirect: '/user/signout', signup_out_name: 'Sign Out' });
			} else {
				res.render('pages/tt2_listing_page.ejs', { title: listing.title, id: listing.id, body: listing.body, status: listing.status, subsecId: listing.subsectionId, startprice: listing.start_price, auctionend: listing.auction_end, userId: listing.userId, isAuction: listing.is_auction, constants: headerConstants, userstatus_name: 'Login', userstatus_page: 'user/login', signup_out_redirect: '/user/signup', signup_out_name: 'Sign Up' });
			}
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
};

listing.interface('create', (req, res) => {
	if (res.locals.user instanceof User) {
		if (res.locals.user !== null && res.locals.user !== undefined) {
			res.render('pages/listing/create', { constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: '/user/' + res.locals.user.id, signup_out_redirect: '/user/signout', signup_out_name: 'Sign Out' });
		} else {
			res.render('pages/listing/create', { constants: headerConstants, userstatus_name: 'Login', userstatus_page: '/user/login', signup_out_redirect: '/user/signup', signup_out_name: 'Sign Up' });
		}
	} else {
		res.redirect('/user/login?redirect=' + Buffer.from('/listing/create').toString('base64'));
	}
});
