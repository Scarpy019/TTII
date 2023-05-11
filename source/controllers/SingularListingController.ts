import { Listing } from '../models/Listing.js';
import { Subsection } from '../models/Subsection.js';
import { Controller } from './BaseController.js';

const listingItem = new Controller('subcategory', ['subsectionId'], ['listingId']);

listingItem.read = async (req, res) => {
	const listId = (req.params.listingId);
	if ((listId) !== null) {
		const listing = await Listing.findByPk(listId, { include: [Subsection] });
		res.render('pages/tt2_listing_page.ejs', [listing?.title, listing?.id, listing?.body, listing?.status, listing?.subsectionId, listing?.start_price, listing?.auction_end, listing?.userId, listing?.is_auction]);
	}
};
