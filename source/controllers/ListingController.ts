import { Listing } from '../models/Listing.js';
import { Subsection } from '../models/Subsection.js';
import { User } from '../models/User.js';
import { Controller } from './BaseController.js';

const listing = new Controller('listing', [], ['subsectionId']);

listing.read = async (req, res) => {
	const subsecId = Number(req.params.subsectionId);
	if (!isNaN(subsecId)) {
		const subsection = await Subsection.findByPk(subsecId, { include: [Listing] });
		if (subsection !== null) {
			res.render('pages/tt2_listings.ejs', { subsection, subsecId });
			return;
		}
	}
	// TODO: proper redirect
	res.sendStatus(404);
};

listing.interface('create', (req, res) => {
	if (res.locals.user instanceof User) {
		res.render('pages/listing/create');
	} else {
		res.redirect('/user/login?redirect=' + Buffer.from('/listing/create').toString('base64'));
	}
});
