import multer, { diskStorage } from 'multer';
import { Listing, Media } from '../models/index.js';
import { Controller } from './BaseController.js';
import { v4 as uuid } from 'uuid';

const media = new Controller('media');

media.read = async (req, res) => {
	const listingId = req.query.listingId;
	if (listingId !== undefined && typeof listingId === 'string') {
		const listing = await Listing.findByPk(listingId, { include: [Media] });
		const media = listing?.media;
		if (media !== undefined) {
			res.render('pages/misc/listing_media_embed', { media });
		} else {
			res.sendStatus(400);
		}
	} else {
		res.sendStatus(400);
	}
};

media.interface('/draft-img', async (req, res, next) => {
	const listingId = res.locals.user?.draftListingId;
	if (listingId !== undefined && typeof listingId === 'string') {
		const listing = await Listing.findByPk(listingId, { include: [Media] });
		const media = listing?.media;
		if (media !== undefined) {
			res.render('pages/misc/listing_media_embed', { media });
		} else {
			res.sendStatus(400);
		}
	} else {
		res.sendStatus(400);
	}
});

media.create = [
	multer({
		// TODO: add size limitation
		fileFilter: (req, file, callback) => {
			// filter out non-image mime types
			const fileData = file;
			if (fileData !== undefined) {
				const mimetypeClass = fileData.mimetype.split('/')[0];
				if (mimetypeClass === 'image') {
					callback(null, true);
				} else {
					callback(null, false);
				}
			} else {
				// decline non-existant file (this shouldn't ever happen)
				callback(null, false);
			}
		},
		storage: diskStorage({
			destination: './files',
			filename (req, file, callback) {
				const id = uuid();
				const mimearr = file.mimetype.split('/');
				const ext = mimearr[mimearr.length - 1];
				callback(null, `${id}.${ext}`);
			}
		})
	}).single('image'),
	async (req, res) => {
		// check if a user is logged in
		const user = res.locals.user;
		if (user !== undefined && user !== null) {
			/*
			 * get the draft listing that user has or make one instead
			 * because there should be a draft listing anyway,
			 * it doesn't matter if the file exists or not and
			 * weather the listing fails or not
			 */
			const draftListingRet = (await Listing.findOrCreate({
				where: {
					userId: user.id,
					is_draft: true,
					// if the draftListingId does not exist, put something that definitely won't exist
					id: user.draftListingId ?? ''
				},
				defaults: {
					subsectionId: 1,
					id: uuid(),
					title: 'Draft listing',
					body: '',
					start_price: 100,
					status: 'draft',
					userId: user.id,
					is_draft: true
				}
			}));
			const draftListing = draftListingRet[0];
			const created = draftListingRet[1];
			// if the draft listing didn't exist before, add it to the user
			if (created) {
				user.draftListingId = draftListing.id;
				await user.save();
			}
			// check if the file actually exists
			const fileData = req.file;
			if (fileData !== undefined) {
				// make the entry
				const dat = fileData.filename.split('.');
				const id = dat[0];
				const ext = `.${dat[1]}`;
				await Media.create({
					uuid: id,
					extension: ext,
					listingId: draftListing.id
				});
				res.sendStatus(200);
			} else {
				res.sendStatus(400);
			}
		} else {
			// unauthenticated users should not be allowed uploading images
			res.sendStatus(401);
		}
	}
];
