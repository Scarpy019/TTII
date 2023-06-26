import multer, { diskStorage } from 'multer';
import { Listing, Media, type User } from '../models/index.js';
import { Controller } from './BaseController.js';
import { v4 as uuid } from 'uuid';
import { isLoggedOn } from '../middleware/ObjectCheckingMiddleware.js';
import { decodeUUID, encodeUUID } from '../middleware/UUIDmiddleware.js';

const media = new Controller('media');

// decreases all media order numbers as much as possible
async function cleanupMedia (listingId: string): Promise<void> {
	const remainingMedia = await Media.findAll({ where: { listingId }, order: [['orderNumber', 'ASC']] });
	for (let i = 0; i < remainingMedia.length; i++) {
		// Sequelize doesn't like me changing the primary key but i must
		if (remainingMedia[i].orderNumber !== i + 1) {
			await Media.update({
				orderNumber: i + 1
			},
			{
				where: {
					orderNumber: remainingMedia[i].orderNumber
				}
			});
		}
	}
}

async function userOwnsListing (user: User, listingId: string): Promise<boolean> {
	return (await Listing.count({
		where: {
			userId: user.id,
			id: listingId
		}
	})) > 0;
}

media.read = async (req, res) => {
	const listingId = req.query.listingId;
	if (listingId !== undefined && typeof listingId === 'string') {
		const listing = await Listing.findByPk(decodeUUID(listingId), { include: [Media] });
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
		if (isLoggedOn(user)) {
			next();
		} else {
			res.sendStatus(400);
		}
	},
	multer({
		limits: {
			fileSize: 20_000_000
		},
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
		if (listingId !== undefined && listingId !== null && typeof listingId === 'string') {
			// check if a user is logged in again for safe typing
			const user = res.locals.user;
			// check login
			if (user === null || user === undefined) {
				res.sendStatus(401);
				return;
			}
			if (!await userOwnsListing(user, listingId)) {
				res.sendStatus(401);
				return;
			}
			await cleanupMedia(listingId);
			const media = await Media.findAll({ where: { listingId } });
			const fileData = req.files;
			if (fileData !== undefined && Array.isArray(fileData)) {
				fileData.forEach(async (file, i) => {
					// make the entry
					const dat = file.filename.split('.');
					const id = dat[0];
					const ext = `.${dat[1]}`;
					await Media.create({
						uuid: id,
						orderNumber: media.length + i + 1,
						extension: ext,
						listingId
					});
				});
				await cleanupMedia(listingId);
				res.redirect(`/listing/item?id=${encodeUUID(listingId)}`); // Redirects to newly created listing
			} else {
				res.sendStatus(400);
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
	const user = res.locals.user;
	// check login
	if (user === null || user === undefined) {
		res.sendStatus(401);
		return;
	}
	if (!await userOwnsListing(user, listingId)) {
		res.sendStatus(401);
		return;
	}
	if (listingId !== undefined && listingId !== null && typeof listingId === 'string') {
		await cleanupMedia(listingId);
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
			// if both exist swap image UUIDs and extensions,
			// because swapping of unique fields is a nono in MySQL
			[mediaA.uuid, mediaB.uuid] = [mediaB.uuid, mediaA.uuid];
			[mediaA.extension, mediaB.extension] = [mediaB.extension, mediaA.extension];
			await mediaA.save();
			await mediaB.save();
			await cleanupMedia(listingId);
		} else {
			res.sendStatus(400);
		}
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
};

media.delete = [
	// permission check
	async (req, res, next) => {
		if (req.body.mediaId === null || req.body.mediaId === undefined) {
			res.status(400);
			res.send('non-existant body data');
			return;
		}
		const media = await Media.findOne({
			where: {
				uuid: req.body.mediaId
			},
			include: [Listing]
		});
		res.locals.media = media;
		// the user exists
		if (res.locals.user === null || res.locals.user === undefined) {
			res.status(400);
			res.send('user no exist');
			return;
		}

		// check if the media item exists
		if (media === null || media === undefined) {
			res.status(400);
			res.send('media no exist');
			return;
		}

		// check if its listing exists
		if (media.listings === null || media.listings === undefined) {
			res.status(400);
			res.send('media listing no exist');
			return;
		}

		// the user is the owner of the listing that has this media item
		if (media.listings.userId !== res.locals.user.id) {
			res.status(401);
			res.send('wrong user');
			return;
		}
		next();
	},
	async (req, res, next) => {
		if (res.locals.media === null || res.locals.media === undefined) {
			// typeguard for a local, should never execute
			res.status(500);
			res.send('media no exist???');
			return;
		}
		if (!(res.locals.media instanceof Media)) {
			res.status(400);
			res.send('media aint media???');
			return;
		}
		const listingId = res.locals.media.listingId;
		await res.locals.media.destroy();
		await cleanupMedia(listingId);
		res.sendStatus(200);
	}
];
