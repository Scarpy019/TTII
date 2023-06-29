import { logger } from 'yatsl';
import { isLoggedOn } from '../middleware/ObjectCheckingMiddleware.js';
import { Bid, Listing, User } from '../models/index.js';
import { Controller } from './BaseController.js';
import { headerConstants } from './config.js';
import { decodeUUID, encodeUUID } from '../middleware/UUIDmiddleware.js';

const bid = new Controller('bid');


interface BidBody {
	bid_amount: number;
	listingid: string;
};


function ValidBidCreationForm (obj: any): obj is BidBody {
	const valid = 'bid_amount' in obj && typeof obj['bid_amount'] === 'string' && !isNaN(Number(obj['bid_amount'])) && Number(obj['bid_amount']) > 0
					&& typeof obj['listingid'] === 'string';
	return valid;
}

bid.create = bid.handler(ValidBidCreationForm,
	async (req, res) => {
		if (res.locals.user === undefined) return res.sendStatus(500); // Something happened to Auth middleware
		if (res.locals.user === null) return res.sendStatus(403); // User is not logged in!

		const listId = req.body.listingid;
		const listing = await Listing.findByPk(listId);
		if(listing === null) return res.sendStatus(404);
		if(!listing.is_auction || (listing.auction_end && listing.auction_end.getTime() < Date.now())) return res.sendStatus(400);

		const bidCheck = await Bid.findOne({
			where: {
				listingId: listId,
				userId: res.locals.user.id
			}
		});

		if (bidCheck !== null) return res.sendStatus(400);

		await Bid.create({
			userId: res.locals.user.id,
			listingId: listing.id,
			bid_amount: Number(req.body.bid_amount)
		});

		return res.redirect('/listing/item?id=' + encodeUUID(req.body.listingid));
});

bid.update = bid.handler(ValidBidCreationForm,
	async (req, res) => {
		if (res.locals.user === undefined) return res.sendStatus(500); // Something happened to Auth middleware
		if (res.locals.user === null) return res.sendStatus(403); // User is not logged in!

		const listId = req.body.listingid;
		if (!listId) return res.sendStatus(404);
		const listing = await Listing.findByPk(listId);
		if(listing === null) return res.sendStatus(404);
		if(!listing.is_auction || (listing.auction_end && listing.auction_end.getTime() < Date.now())) return res.sendStatus(400);

		const bid = await Bid.findOne({
			where: {
				listingId: listId,
				userId: res.locals.user.id
			}
		});

		if (bid === null) return res.sendStatus(400);

		bid.bid_amount = Number(req.body.bid_amount);
		await bid.save();

		return res.redirect('/listing/item?id=' + encodeUUID(req.body.listingid));
});

bid.delete = bid.handler(ValidBidCreationForm,
	async (req, res) => {
		if (res.locals.user === undefined) return res.sendStatus(500); // Something happened to Auth middleware
		if (res.locals.user === null) return res.sendStatus(403); // User is not logged in!

		const listId = req.body.listingid as string;
		const listing = await Listing.findByPk(listId);
		if(listing === null) return res.sendStatus(404);
		if(!listing.is_auction) return res.sendStatus(400); // Should be able to delete it even after it ends

		const bid = await Bid.findOne({
			where: {
				listingId: decodeUUID(listId),
				userId: res.locals.user.id
			}
		});

		if (bid === null) return res.sendStatus(400);

		await bid.destroy();
		return res.redirect('/listing/item?id=' + req.body.listingid);
});

// Not sure if necessary
// bid.read = [async (req, res) => {
// 	if (res.locals.user === undefined) return res.sendStatus(500); // Something happened to Auth middleware
// 	if (res.locals.user === null) return res.sendStatus(403); // User is not logged in!

// 	const listing = await Listing.findByPk(req.params.listingId);
// 	if(listing === null) return res.sendStatus(404);
// 	if(!listing.is_auction || (listing.auction_end !== undefined && listing.auction_end.getTime() < Date.now())) return res.sendStatus(400);

// 	const bid = await Bid.findOne({
// 		where: {
// 			listingId: listing.id,
// 			userId: res.locals.user.id
// 		}
// 	});

// 	if (bid === null) return res.sendStatus(400);
// 	return res.render(''); // view for bids
// }];

bid.interface('/create', async (req, res) => {
	if (res.locals.user instanceof User) {
		const listId = req.query.id as string;
		const listing = await Listing.findByPk(decodeUUID(listId));
		if(listing === null) return res.sendStatus(404);
		if(!listing.is_auction || (listing.auction_end && listing.auction_end.getTime() < Date.now())) 
			return res.redirect('/listing/item?id=' + req.query.id);
		
		const bidCheck = await Bid.findOne({
			where: {
				listingId: decodeUUID(listId),
				userId: res.locals.user.id
			}
		});
		if (bidCheck !== null) return res.redirect('/bid/edit?id=' + listId);
		
		if (isLoggedOn(res.locals.user)) {
			res.render('pages/bid/create', { // User can access the create listing page from a subcategory page where it autofills the category and subcategory
				constants: headerConstants,
				listingid: decodeUUID(listId)
			});
		}
	} else {
		res.redirect('/user/login?redirect=' + Buffer.from('_bid_create').toString('ascii'));
	}
});

bid.interface('/edit', async (req, res) => {
	if (res.locals.user instanceof User) {
		const listId = req.query.id as string;
		const listing = await Listing.findByPk(decodeUUID(listId));
		if(listing === null) return res.sendStatus(404);
		if(!listing.is_auction || (listing.auction_end && listing.auction_end.getTime() < Date.now())) 
			return res.redirect('/listing/item?id=' + req.query.id);
		
		const bid = await Bid.findOne({
			where: {
				listingId: decodeUUID(listId),
				userId: res.locals.user.id
			}
		});
		if (bid === null) return res.redirect('/bid/create?id=' + listId);
		
		if (isLoggedOn(res.locals.user)) {
			res.render('pages/bid/edit', { // User can access the create listing page from a subcategory page where it autofills the category and subcategory
				constants: headerConstants,
				listingid: decodeUUID(listId),
				current_bid: bid.bid_amount
			});
		}
	} else {
		res.redirect('/user/login?redirect=' + Buffer.from('_bid_edit').toString('ascii'));
	}
});