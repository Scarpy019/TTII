import { Listing } from "../models/index.js";
import { auctions as config } from '../config.js';

// A function that will periodically check all Listings to see if they are auctions that need closing (their end time has ellapsed)
async function checkAllAuctions () {
	const listings = await Listing.findAll();

	listings.forEach(listing => {
		if (listing.is_auction && listing.auction_end && listing.auction_end.getTime() >= Date.now()) {
			listing.status = 'closed';
			listing.save();
		}
	});
}

export function startAuctionCheckInterval () {
	setInterval(checkAllAuctions, config.auctionResolution);	
}