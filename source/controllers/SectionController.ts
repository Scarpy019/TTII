import { Section } from '../models/Section.js';
import { Controller } from './BaseController.js';
import { type User } from '../models/User.js';
import { headerConstants } from './config.js';

const section = new Controller('section');

section.read = async (req, res) => {
	const sections = await Section.findAll();
	if (res.locals.user !== null && res.locals.user !== undefined) { // for header Login&sign up or username& sign out
		const user: User = res.locals.user;
		res.render('pages/main/sections_mainpage.ejs', { sections, sectionName: section.name, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/profile/${user.id}` });
	} else {
		res.render('pages/main/sections_mainpage.ejs', { sections, sectionName: section.name, constants: headerConstants });
	}
};
