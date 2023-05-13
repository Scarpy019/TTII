import { Section } from '../models/Section.js';
import { headerConstants } from './config.js';
import { Controller } from './BaseController.js';

const section = new Controller('section');

section.read = async (req, res) => {
	const sections = await Section.findAll();
	if (res.locals.user !== null && res.locals.user !== undefined) {
		res.render('pages/tt2_mainpage_skeleton.ejs', { sections, sectionName: section.name, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: '/user/' + res.locals.user.id, signup_out_redirect: '/user/signout', signup_out_name: 'Sign Out' });
	} else {
		res.render('pages/tt2_mainpage_skeleton.ejs', { sections, sectionName: section.name, constants: headerConstants, userstatus_name: 'Login', userstatus_page: '/user/login', signup_out_redirect: '/user/signup', signup_out_name: 'Sign Up' });
	}
};
