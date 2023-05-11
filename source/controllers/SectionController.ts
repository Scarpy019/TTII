import { Section } from '../models/Section.js';
import { Controller } from './BaseController.js';

const section = new Controller('section');

section.read = async (req, res) => {
	const sections = await Section.findAll();
	// const headerValues = ['pages/misc/header_val.json'];
	res.render('pages/tt2_mainpage_skeleton.ejs', { sections, sectionName: section.name });
};
