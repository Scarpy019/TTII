
import { Op } from 'sequelize';
import { Listing } from '../models/Listing.js';
import { Media } from '../models/Media.js';
import { User } from '../models/User.js';
import { Controller } from './BaseController.js';

import { headerConstants } from './config.js';

const search = new Controller('search');

search.read = async (req, res) => {
	const alllistings = await Listing.findAll({ include: [{ model: User, as: 'user' }, Media] });
	res.render('pages/main/search.ejs', {
		listings: alllistings,
		hidenbydefault: 'yes',
		constants: headerConstants,
		originURL: '_search' // For redirect purposes with login button
	});
};

search.interface('/result', async (req, res) => {
	const keyword = String(req.query.keyword);
	const validlistings = await Listing.findAll({ where: { title: { [Op.like]: `%${keyword}%` } }, include: [{ model: User, as: 'user' }, Media] });
	res.render('pages/main/search.ejs', {
		listings: validlistings,
		constants: headerConstants,
		hidenbydefault: 'no',
		originURL: `_search_result?keyword=${keyword}` // For redirect purposes with login button
	});
});
