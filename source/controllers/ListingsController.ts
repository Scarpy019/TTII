import { Listing } from '../models/Listing.js';
import { Subsection } from '../models/Subsection.js';
import { Controller } from './BaseController.js';

const listing = new Controller('listings', ['subsectionId']);

listing.read = async (req, res) => {
	const subsecId = Number(req.params.subsectionId);
	if (!isNaN(subsecId)) {
		const subsection = await Subsection.findByPk(subsecId, { include: [Listing] });
		if (subsection !== null) {
			res.render('pages/tt2_listings.ejs', { subsection, subsecId });
		}
	}
};
