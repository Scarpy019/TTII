import { Listing } from '../models/index.js';
import { auctions as config } from '../config.js';

// A function that will periodically check all Listings to see if they are auctions that need closing (their end time has ellapsed)
async function checkAllAuctions (): Promise<void> {
	const listings = await Listing.findAll();

	listings.forEach(async listing => {
		if (listing.is_auction !== null && (listing.auction_end != null) && listing.auction_end.getTime() >= Date.now()) {
			listing.status = 'closed';
			await listing.save();
		}
	});
}

export function startAuctionCheckInterval (): void {
	setInterval(checkAllAuctions, config.auctionResolution);
}
