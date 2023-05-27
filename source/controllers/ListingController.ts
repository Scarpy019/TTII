import { Listing } from '../models/Listing.js';
import { Section } from '../models/Section.js';
import { Subsection } from '../models/Subsection.js';
import { User } from '../models/User.js';
import { Controller } from './BaseController.js';
import { headerConstants } from './config.js';
import { logger } from '../lib/Logger.js';
import { v4 as uuidv4 } from 'uuid';
import { Media } from '../models/Media.js';
import { isAdmin } from '../middleware/AdminCheckMiddleware.js';

const listing = new Controller('listing', [], ['subsectionId']);

listing.read = async (req, res) => {
	const subsecId = Number(req.params.subsectionId);
	if (!isNaN(subsecId)) {
		const subsection = await Subsection.findByPk(subsecId, { include: [Listing] });
		if (subsection !== null) {
			if (res.locals.user !== null && res.locals.user !== undefined) { // for header Login&sign up or username& sign out
				const user: User = res.locals.user;
				res.render('pages/main/all_listings.ejs', { subsection, subsecId, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/profile/${user.id}`, useraccess: res.locals.user.access });
				return;
			} else {
				res.render('pages/main/all_listings.ejs', { subsection, subsecId, constants: headerConstants, useraccess: 'slikti' });
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
					if (res.locals.user !== null && res.locals.user !== undefined) {
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
						// find the draft's media
						const media = (await Listing.findByPk(res.locals.user.draftListingId ?? '', {
							include: [Media]
						}))?.media;
						if (media !== undefined) {
							// relink all of the draft's media to the newly created listing
							media.forEach(async mediaItem => {
								mediaItem.listingId = newListing.id;
								await mediaItem.save();
							});
						}
					};
					res.redirect(`/listing/${req.body.subcatid}`);
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
	const listId = (req.query.listingId) as unknown;
	if ((listId) !== null && typeof listId === 'string') {
		const listing = await Listing.findByPk(listId, { include: [Subsection] });
		if (listing !== null) {
			const author = await User.findByPk(listing.userId);
			if (author !== null && author !== undefined) {
				if (res.locals.user !== null && res.locals.user !== undefined) {
					const user: User = res.locals.user;
					res.render('pages/main/listing_item.ejs', { picture: listing.media, title: listing.title, id: listing.id, body: listing.body, status: listing.status, subsecId: listing.subsectionId, startprice: listing.start_price, auctionend: listing.auction_end, userId: listing.userId, isAuction: listing.is_auction, createdAt: listing.createdAt, author: author.username, author_profile: author.id, authorid: author.id, currentuserid: user.id, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/profile/${user.id}`, useraccess: res.locals.user.access });
				} else {
					res.render('pages/main/listing_item.ejs', { picture: listing.media, title: listing.title, id: listing.id, body: listing.body, status: listing.status, subsecId: listing.subsectionId, startprice: listing.start_price, auctionend: listing.auction_end, userId: listing.userId, isAuction: listing.is_auction, createdAt: listing.createdAt, author: author.username, author_profile: author.id, authorid: author.id, currentuserid: null, constants: headerConstants, useraccess: 'nav' });
				}
			}
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
});

listing.interface('/edit', async (req, res) => {
	const listId = (req.query.listingId) as unknown;
	if ((listId) !== null && typeof listId === 'string') {
		const listing = await Listing.findByPk(listId);
		if (listing !== null) {
			const author = await User.findByPk(listing.userId);
			const accessuser = res.locals.user;
			if (listing.subsectionId !== null && listing.subsectionId !== undefined) {
				const subcategoryid = listing.subsectionId;
				const subcategory = await Subsection.findByPk(subcategoryid);
				if (subcategory !== null && subcategory !== undefined) {
					const categoryid = subcategory.sectionId;
					const category = await Section.findByPk(categoryid, { include: [Subsection] });
					const allcategory = await Section.findAll({ include: [Subsection] });
					let sectioncount = 0;
					allcategory.forEach(element => {
						if (element.id >= sectioncount && element.id !== null && element.id !== undefined) {
							sectioncount = element.id;
						}
					});
					if (category !== null && category !== undefined) {
						if (accessuser !== undefined && accessuser !== null && author !== null && author !== undefined) {
							if (accessuser.id === author.id || isAdmin(accessuser)) {
								res.render('pages/listing/edit', { listingid: listId, constants: headerConstants, userstatus_page: `/user/profile/${accessuser.id}`, userstatus_name: accessuser.username, existing_title: listing.title, existing_desc: listing.body, existing_startprice: listing.start_price, existing_status: listing.status, existing_subcategoryid: subcategoryid, existing_categoryid: categoryid, sections: allcategory, sectioncount });
							} else {
								res.redirect('/section');
							}
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
			const listinginstance = await Listing.findByPk(req.body.listingid);
			if (listinginstance !== null) {
				listinginstance.title = req.body.listing_name;
				listinginstance.body = req.body.listing_description;
				listinginstance.status = req.body.openstatus;
				listinginstance.start_price = Number(req.body.startprice);
				listinginstance.subsectionId = Number(req.body.subcatid);
				await listinginstance.save();
				res.redirect(`item?listingId=${listinginstance.id}`);
			}
		} catch (error) {
			res.send(error);
		};
	}
);

listing.override('delete', '/listing/delete');

listing.delete = async (req, res) => {
	const listingid = req.body.listingId;
	if (listingid !== null && listingid !== undefined && res.locals.user !== null && res.locals.user !== undefined) {
		const listingrow = await Listing.findByPk(listingid);
		if (listingrow !== undefined && listingrow !== null) {
			const author = listingrow.userId;
			const requestinguser = res.locals.user;
			const requestinguserid = res.locals.user.id;
			if (author === requestinguserid || isAdmin(requestinguser)) {
				if (listingrow !== null && listingrow !== undefined) {
					await listingrow.destroy();
					res.redirect(`/user/profile/${requestinguserid}`);
				}
			}
		}
	}
};

listing.interface('/create', async (req, res) => {
	if (res.locals.user instanceof User) {
		const sections = await Section.findAll({ include: [Subsection] });
		let sectioncount = 0;
		sections.forEach(element => {
			if (element.id >= sectioncount && element.id !== null && element.id !== undefined) {
				sectioncount = element.id;
			}
		});
		if (res.locals.user !== undefined && res.locals.user !== null) {
			const user: User = res.locals.user;
			res.render('pages/listing/create', { constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/profile/${user.id}`, sections, sectioncount });
		} else {
			res.render('pages/listing/create', { constants: headerConstants });
		}
	} else {
		res.redirect('/user/login?redirect=' + Buffer.from('/listing/create').toString('base64'));
	}
});
