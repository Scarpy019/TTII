import { Section } from '../models/Section.js';
import { Subsection } from '../models/Subsection.js';
import { Controller } from './BaseController.js';
import { headerConstants } from './config.js';

const subsection = new Controller('subsection', ['sectionId']);

subsection.read = async (req, res) => {
	const secId = Number(req.params.sectionId);
	if (!isNaN(secId)) {
		const section = await Section.findByPk(secId, { include: [Subsection] });
		if (section !== null) {
			if (res.locals.user !== null && res.locals.user !== undefined) {
				res.render('pages/main/subcategory_list.ejs', { section, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: '/user/' + res.locals.user.id, signup_out_redirect: '/user/signout', signup_out_name: 'Sign Out' });
			} else {
				res.render('pages/main/subcategory_list.ejs', { section, constants: headerConstants, userstatus_name: 'Login', userstatus_page: '/user/login', signup_out_redirect: '/user/signup', signup_out_name: 'Sign Up' });
			}
		}
	}
};
