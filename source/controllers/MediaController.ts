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
	// precheck user auth to prevent file uploads
	(req, res, next) => {
		const user = res.locals.user;
		if (user !== undefined && user !== null) {
			next();
		} else {
			res.sendStatus(400);
		}
	},
	multer({
		limits: {
			fileSize: 20_000_000
		},
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
	}).array('image[]'),
	async (req, res) => {
		const listingId: unknown = req.body.listingId;
		console.log(req.files, listingId);
		if (listingId !== undefined && listingId !== null && typeof listingId === 'string') {
			// check if a user is logged in again for safe typing
			const user = res.locals.user;
			if (user !== undefined && user !== null) {
				const fileData = req.files;
				if (fileData !== undefined && Array.isArray(fileData)) {
					fileData.forEach(async (file, i) => {
						// make the entry
						const dat = file.filename.split('.');
						const id = dat[0];
						const ext = `.${dat[1]}`;
						await Media.create({
							uuid: id,
							orderNumber: i + 1,
							extension: ext,
							listingId
						});
					});
					res.sendStatus(200);
				} else {
					res.sendStatus(400);
				}
			} else {
				// unauthenticated users should not be allowed uploading images
				res.sendStatus(401);
			}
		} else {
			res.sendStatus(400);
		}
	}
];

// swap 2 images
media.update = async (req, res) => {
	const listingId = req.body.listingId;
	const swappableAnum = Number(req.body.Anum);
	const swappableBnum = Number(req.body.Bnum);
	if (listingId !== undefined && listingId !== null) {
		const mediaA = await Media.findOne({
			where: {
				listingId,
				orderNumber: swappableAnum
			}
		});
		const mediaB = await Media.findOne({
			where: {
				listingId,
				orderNumber: swappableBnum
			}
		});
		// if only one exists just change the number
		if (mediaA !== null && mediaB === null) {
			mediaA.orderNumber = swappableBnum;
			await mediaA.save();
		} else if (mediaA === null && mediaB !== null) {
			mediaB.orderNumber = swappableAnum;
			await mediaB.save();
		} else if (mediaA !== null && mediaB !== null) {
			// if both exist swap image UUIDs,
			// because swapping of unique fields is a nono
			const temp = mediaB.uuid;
			mediaB.uuid = mediaA.uuid;
			mediaA.uuid = temp;
			await mediaA.save();
			await mediaB.save();
		}
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
};
