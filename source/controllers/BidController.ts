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
	const valid = 'bid_amount' in obj && typeof obj.bid_amount === 'string' && !isNaN(Number(obj.bid_amount)) && Number(obj.bid_amount) > 0 &&
					typeof obj.listingid === 'string';
	return valid;
}

bid.create = bid.handler(ValidBidCreationForm,
	async (req, res) => {
		if (res.locals.user === undefined) return res.sendStatus(500); // Something happened to Auth middleware
		if (res.locals.user === null) return res.sendStatus(403); // User is not logged in!

		const listId = req.body.listingid;
		const listing = await Listing.findByPk(listId);
		if (listing === null) return res.sendStatus(404); // No such listing, cannot add bid
		// If the listing is not an auction or has ended, the request is invalid
		if (listing.is_auction === false || ((listing.auction_end != null) && listing.auction_end.getTime() < Date.now())) return res.sendStatus(400);
		// Similarly, if the price is bad, then the request is invalid as well
		if (listing.start_price !== undefined && req.body.bid_amount < listing.start_price) return res.sendStatus(400);

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

		res.redirect('/listing/item?id=' + encodeUUID(req.body.listingid));
	});

bid.update = bid.handler(ValidBidCreationForm,
	async (req, res) => {
		if (res.locals.user === undefined) return res.sendStatus(500); // Something happened to Auth middleware
		if (res.locals.user === null) return res.sendStatus(403); // User is not logged in!

		const listId = req.body.listingid;
		const listing = await Listing.findByPk(listId);
		if (listing === null) return res.sendStatus(404); // No such listing, cannot add bid
		// If the listing is not an auction or has ended, the request is invalid
		if (listing.is_auction === false || ((listing.auction_end != null) && listing.auction_end.getTime() < Date.now())) return res.sendStatus(400);
		// Similarly, if the price is bad, then the request is invalid as well
		if (listing.start_price !== undefined && req.body.bid_amount < listing.start_price) return res.sendStatus(400);

		const bid = await Bid.findOne({
			where: {
				listingId: listId,
				userId: res.locals.user.id
			}
		});

		if (bid === null) return res.sendStatus(400);

		bid.bid_amount = Number(req.body.bid_amount);
		await bid.save();

		res.redirect('/listing/item?id=' + encodeUUID(req.body.listingid));
	});

bid.delete = bid.handler(ValidBidCreationForm,
	async (req, res) => {
		if (res.locals.user === undefined) return res.sendStatus(500); // Something happened to Auth middleware
		if (res.locals.user === null) return res.sendStatus(403); // User is not logged in!

		const listId = req.body.listingid;
		const listing = await Listing.findByPk(listId);
		if (listing === null) return res.sendStatus(404); // Cannot find listing, so 404
		if (listing.is_auction === false) return res.sendStatus(400); // Should be able to delete it even after it ends

		const bid = await Bid.findOne({
			where: {
				listingId: decodeUUID(listId),
				userId: res.locals.user.id
			}
		});

		if (bid === null) return res.sendStatus(400);

		await bid.destroy();
		res.redirect('/listing/item?id=' + req.body.listingid);
	});

// Do not need this, bids are visible on item page
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
		if (req.query.id === undefined) return res.sendStatus(404);
		// Find the listing
		const listId = req.query.id as string;
		const listing = await Listing.findByPk(decodeUUID(listId));
		if (listing === null) return res.sendStatus(404);
		// If the listing is not an auction, redirect back to the listing page
		if (listing.is_auction === false || ((listing.auction_end != null) && listing.auction_end.getTime() < Date.now())) {
			res.redirect(`/listing/item?id=${req.query.id as string}`);
			return;
		}

		const bidCheck = await Bid.findOne({
			where: {
				listingId: decodeUUID(listId),
				userId: res.locals.user.id
			}
		});
		// If there is an existing bid, redirect the user to the edit page
		if (bidCheck !== null) { res.redirect('/bid/edit?id=' + listId); return; }

		if (isLoggedOn(res.locals.user)) {
			res.render('pages/bid/create', {
				constants: headerConstants,
				listingid: decodeUUID(listId)
			});
		}
	} else {
		res.redirect('/user/login?redirect=' + Buffer.from(`_bid_create?id=${req.query.id as string}`).toString('ascii'));
	}
});

bid.interface('/edit', async (req, res) => {
	if (res.locals.user instanceof User) {
		if (req.query.id === undefined) return res.sendStatus(404);
		const listId = req.query.id as string;
		const listing = await Listing.findByPk(decodeUUID(listId));
		if (listing === null) return res.sendStatus(404);
		// If the listing is not an auction, redirect back to the listing page
		if (listing.is_auction === false || ((listing.auction_end != null) && listing.auction_end.getTime() < Date.now())) {
			res.redirect(`/listing/item?id=${req.query.id as string}`);
			return;
		}

		const bid = await Bid.findOne({
			where: {
				listingId: decodeUUID(listId),
				userId: res.locals.user.id
			}
		});
		// If there is no existing bid, redirect the user to the create page
		if (bid === null) { res.redirect('/bid/create?id=' + listId); return; }

		if (isLoggedOn(res.locals.user)) {
			res.render('pages/bid/edit', {
				constants: headerConstants,
				listingid: decodeUUID(listId),
				current_bid: bid.bid_amount
			});
		}
	} else {
		res.redirect('/user/login?redirect=' + Buffer.from(`_bid_edit?id=${req.query.id as string}`).toString('ascii'));
	}
});
