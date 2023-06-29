import { Listing } from '../models/Listing.js';
import { Section } from '../models/Section.js';
import { Subsection } from '../models/Subsection.js';
import { User } from '../models/User.js';
import { Controller } from './BaseController.js';
import { headerConstants } from './config.js';
import { logger } from '../lib/Logger.js';
import { v4 as uuidv4 } from 'uuid';
import { Media } from '../models/Media.js';
import { doesUserExist, isAdmin, isCategory, isListing, isLoggedOn, isSubcategory, isUserAuthor } from '../middleware/ObjectCheckingMiddleware.js';
import { decodeUUID, encodeUUID } from '../middleware/UUIDmiddleware.js';

const listing = new Controller('listing', [], ['subsectionId']);

listing.read = async (req, res) => {
	if (isLoggedOn(res.locals.user)) {
		if (res.locals.user.banned) {
			res.clearCookie('AuthToken');
			res.redirect('/section');
			return;
		}
	}
	const subsecId = Number(req.params.subsectionId);
	if (!isNaN(subsecId)) {
		const listings = await Listing.findAll({ where: { subsectionId: subsecId }, limit: 5000, include: [{ model: User, as: 'user' }, Media] });
		const subsection = await Subsection.findByPk(subsecId);
		if (isSubcategory(subsection)) {
			res.render('pages/main/all_listings.ejs', {
				subsec_name: (req.cookies.lang === 'LV') ? subsection.nameLV : subsection.name,
				listings,
				subsecId,
				constants: headerConstants,
				subsec_Id: String(subsecId),
				secId: subsection.sectionId,
				originURL: `_listing_${String(subsecId)}` // For redirect purposes with login button
			});
		}
	} else {
		// TODO: proper redirect
		res.sendStatus(404);
	}
};

interface ListingCreationForm {
	listing_name: string;
	listing_description: string;
	startprice: string;
	openstatus: string;
	subcatid: string;
};

function ValidListingCreationForm (obj: any): obj is ListingCreationForm {
	const valid =
		('startprice' in obj) && typeof obj.startprice === 'string' && !isNaN(Number(obj.startprice)) && Number(obj.startprice) > 0 && Number(obj.startprice) < 10_000 &&
		('listing_name' in obj) && typeof obj.listing_name === 'string' &&
		('listing_description' in obj) && typeof obj.listing_description === 'string' &&
		('subcatid' in obj) && typeof obj.subcatid === 'string' && !isNaN(Number(obj.subcatid)) &&
		('openstatus' in obj) && typeof obj.openstatus === 'string';
	return valid;
};

interface ListingUpdateForm {
	listing_name: string;
	listing_description: string;
	startprice: string;
	openstatus: string;
	subcatid: string;
	listingid: string;
};

function ValidListingUpdateForm (obj: any): obj is ListingUpdateForm {
	const valid =
		('startprice' in obj) && typeof obj.startprice === 'string' && !isNaN(Number(obj.startprice)) && Number(obj.startprice) > 0 && Number(obj.startprice) < 10_000 &&
		('listing_name' in obj) && typeof obj.listing_name === 'string' &&
		('listing_description' in obj) && typeof obj.listing_description === 'string' &&
		('subcatid' in obj) && typeof obj.subcatid === 'string' && !isNaN(Number(obj.subcatid)) &&
		('openstatus' in obj) && typeof obj.openstatus === 'string' && ('listingid' in obj) && typeof obj.listingid === 'string';
	return valid;
};

listing.create = [
	async (req, res): Promise<void> => {
		if (ValidListingCreationForm(req.body)) {
			try {
				if (await Subsection.findByPk(Number(req.body.subcatid)) !== null) {
					if (isLoggedOn(res.locals.user)) {
						// generate the new listing
						const newListing = await Listing.create({
							id: uuidv4(),
							title: req.body.listing_name,
							body: req.body.listing_description,
							status: req.body.openstatus,
							start_price: Number(req.body.startprice),
							userId: res.locals.user.id,
							subsectionId: Number(req.body.subcatid),
							is_draft: false
						});
						res.json({ listingId: newListing.id });
						return;
					};
				} else {
					logger.info('Subcategory was invalid');
					res.sendStatus(400);
				}
			} catch (error) {
				res.status(500);
				res.send(error);
			};
		} else {
			logger.info('Body did not match', req.body);
			res.sendStatus(400);
		}
	}
];

listing.interface('/item', async (req, res) => {
	if (isLoggedOn(res.locals.user)) {
		if (res.locals.user.banned) {
			res.clearCookie('AuthToken');
			res.redirect('/section');
			return;
		}
	}
	const listId = (req.query.id) as unknown;
	if ((listId) !== null && typeof listId === 'string') {
		const listing = await Listing.findByPk(decodeUUID(listId), { include: [Subsection, Media] });
		if (isListing(listing)) {
			res.locals.media = [];
			if (listing.media !== undefined && listing.media !== null) {
				const arr = listing.media;
				arr.sort((a, b) => a.orderNumber - b.orderNumber);
				res.locals.media = arr;
			}
			const author = await User.findByPk(listing.userId);
			if (doesUserExist(author)) {
				if (
					(author.banned &&
					(isLoggedOn(res.locals.user) && !res.locals.user.accesslevel.category_admin && author.id !== res.locals.user.id)) ||
					(author.banned &&
					(res.locals.user === null || res.locals.user === undefined))
				) { // Forces redirect to section if accesed listing author is banned unless you have admin privileges
					res.redirect('/section');
				} else {
					if ((listing.status === 'open') || (listing.status === 'closed' && isLoggedOn(res.locals.user) && (res.locals.user.id === author.id || res.locals.user.accesslevel.category_admin))) {
						res.render('pages/main/listing_item.ejs', {
							listing,
							author: author.username,
							author_profile: author.username,
							authorid: author.id,
							constants: headerConstants,
							originURL: `_listing_item?id=${encodeUUID(listing.id)}` // For redirect purposes with login button
						});
					} else if (listing.status === 'closed') {
						res.redirect('/section');
					}
				}
			}
		}
	} else {
		res.sendStatus(404);
	}
});

listing.interface('/edit', async (req, res) => {
	const listId = (req.query.id) as unknown;
	if ((listId) !== null && typeof listId === 'string') {
		const listing = await Listing.findByPk(decodeUUID(listId), { include: [Media] });
		if (isListing(listing)) {
			const author = await User.findByPk(listing.userId);
			const accessuser = res.locals.user;
			res.locals.media = listing.media ?? [];
			if (listing.subsectionId !== null && listing.subsectionId !== undefined) {
				const subcategoryid = listing.subsectionId;
				const subcategory = await Subsection.findByPk(subcategoryid);
				if (isSubcategory(subcategory)) {
					const categoryid = subcategory.sectionId;
					const category = await Section.findByPk(categoryid, { include: [Subsection] });
					const allcategory = await Section.findAll({ include: [Subsection] });
					let sectioncount = 0;
					allcategory.forEach(element => {
						if (element.id >= sectioncount && element.id !== null && element.id !== undefined) {
							sectioncount = element.id;
						}
					});
					if (isCategory(category)) {
						if (isLoggedOn(accessuser) && doesUserExist(author)) {
							if (isUserAuthor(accessuser, author) || isAdmin(accessuser)) { // Both the author and admin can edit listing
								res.render('pages/listing/edit', { // Used for filling all the form with current listing data
									listingid: decodeUUID(listId),
									constants: headerConstants,
									existing_title: listing.title,
									existing_desc: listing.body,
									existing_startprice: listing.start_price,
									existing_status: listing.status,
									existing_subcategoryid: subcategoryid,
									existing_categoryid: categoryid,
									sections: allcategory,
									sectioncount
								});
							} else {
								res.redirect('/section');
							}
						} else {
							res.redirect('/section');
						}
					}
				}
			}
		}
	}
});

listing.override('update', '/listing/update');

listing.update = listing.handler(
	ValidListingUpdateForm,
	async (req, res): Promise<void> => {
		try {
			const listinginstance = await Listing.findByPk(decodeUUID(req.body.listingid));
			if (isListing(listinginstance)) {
				listinginstance.title = req.body.listing_name;
				listinginstance.body = req.body.listing_description;
				listinginstance.status = req.body.openstatus;
				listinginstance.start_price = Number(req.body.startprice);
				listinginstance.subsectionId = Number(req.body.subcatid);
				await listinginstance.save();
				res.redirect(`item?id=${encodeUUID(listinginstance.id)}`);
			}
		} catch (error) {
			res.send(error);
		};
	}
);

const listingstatus = listing.subcontroller('listingstatus');

listingstatus.update = async (req, res) => {
	const listinginstance = await Listing.findByPk(decodeUUID(req.body.listingid));
	const changestatus = req.body.newstatus;
	if (changestatus === 'open' || changestatus === 'closed') {
		if (isListing(listinginstance)) {
			listinginstance.status = changestatus;
			await listinginstance.save();
			res.redirect(`item?id=${encodeUUID(listinginstance.id)}`);
		}
	}
};

listingstatus.override('update', '/listing/statusupdate');

listing.override('delete', '/listing/delete');

listing.delete = async (req, res) => {
	const listingid = decodeUUID(req.body.listingId);
	if (listingid !== null && listingid !== undefined && isLoggedOn(res.locals.user)) {
		const listingrow = await Listing.findByPk(listingid);
		if (isListing(listingrow)) {
			const author = await User.findByPk(listingrow.userId);
			const requestinguser = res.locals.user;
			if (isUserAuthor(requestinguser, author) || isAdmin(requestinguser)) {
				if (isListing(listingrow)) {
					await listingrow.destroy();
					res.redirect(`/user/profile/${requestinguser.username}`);
				}
			}
		}
	}
};

listing.interface('/create', async (req, res) => {
	if (res.locals.user instanceof User) {
		const sections = await Section.findAll({ include: [Subsection] });
		let sectioncount = 0;
		const secId = req.query.sectionId;
		const subsecId = req.query.subsectionId;
		sections.forEach(element => {
			if (element.id >= sectioncount && element.id !== null && element.id !== undefined) {
				sectioncount = element.id;
			}
		});
		if (isLoggedOn(res.locals.user)) {
			if (secId !== null && secId !== undefined && subsecId !== null && subsecId !== undefined) {
				res.render('pages/listing/create', { // User can access the create listing page from a subcategory page where it autofills the category and subcategory
					constants: headerConstants,
					sections,
					sectioncount,
					currentsection: secId,
					currentsubsection: subsecId,
					createfromexistsubcat: 'true'
				});
			} else {
				res.render('pages/listing/create', { // There is no autofill for listings because this comes from the Create listing button in the header
					constants: headerConstants,
					sections,
					sectioncount,
					currentsection: 'null',
					currentsubsection: 'null',
					createfromexistsubcat: 'false'
				});
			}
		} else {
			res.render('pages/listing/create', { // Sends the non logged in user to the page but a different function redirects the user to login page
				constants: headerConstants
			});
		}
	} else {
		res.redirect('/user/login?redirect=' + Buffer.from('_listing_create').toString('ascii'));
	}
});
