import { isAdmin, isLoggedOn } from '../middleware/AdminCheckMiddleware.js';
import { Section } from '../models/Section.js';
import { Controller } from './BaseController.js';

import { headerConstants } from './config.js';

const section = new Controller('section');

section.read = async (req, res) => {
	const sections = await Section.findAll();
	res.render('pages/main/sections_mainpage.ejs', {
		sections,
		sectionName: section.name,
		constants: headerConstants
	});
};

interface SectionCreateForm {
	section_name: string;
};

interface SectionEditForm {
	section_name: string;
	section_id: string;
};

function ValidSectionCreateForm (obj: any): obj is SectionCreateForm {
	const valid = ('section_name' in obj) && typeof obj.section_name === 'string';
	return valid;
};

function ValidSectionUpdateForm (obj: any): obj is SectionEditForm {
	const valid = ('section_name' in obj) && typeof obj.section_name === 'string' && ('section_id' in obj) && typeof obj.section_id === 'string';
	return valid;
};

section.create = [
	async (req, res): Promise<void> => {
		if (ValidSectionCreateForm(req.body)) {
			try {
				if (isLoggedOn(res.locals.user)) {
					if (isAdmin(res.locals.user)) {
						await Section.create({
							name: req.body.section_name
						});
					}
				};
				res.redirect('/section');
			} catch (error) {
				res.status(500);
				res.send(error);
			};
		} else {
			res.sendStatus(404);
		}
	}
];

section.update = section.handler(
	ValidSectionUpdateForm,
	async (req, res): Promise<void> => {
		if (isLoggedOn(res.locals.user)) {
			if (isAdmin(res.locals.user)) {
				try {
					const sectioninstance = await Section.findByPk(req.body.section_id);
					if (sectioninstance !== null) {
						sectioninstance.name = req.body.section_name;
						await sectioninstance.save();
						res.redirect('/section');
					} else {
						res.sendStatus(404);
					}
				} catch (error) {
					res.send(error);
				};
			} else {
				res.sendStatus(404);
			}
		} else {
			res.sendStatus(404);
		}
	}
);

section.delete = async (req, res) => {
	const sectionId = req.body.sectionId;
	if (sectionId !== null && sectionId !== undefined && isLoggedOn(res.locals.user)) {
		if (isAdmin(res.locals.user)) {
			const sectionrow = await Section.findByPk(sectionId);
			if (sectionrow !== undefined && sectionrow !== null) {
				await sectionrow.destroy();
				res.redirect('/section');
			} else {
				res.sendStatus(404);
			}
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
};

section.override('delete', '/section/delete');
section.override('update', '/section/update');

section.interface('/edit', async (req, res) => {
	const editingsection = req.query.sectionId;
	const sections = await Section.findByPk(String(editingsection));
	if (isLoggedOn(res.locals.user) && sections !== null) {
		if (isAdmin(res.locals.user)) {
			res.render('pages/admin/section_edit.ejs', {
				oldsectionname: sections.name,
				constants: headerConstants
			});
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
});

section.interface('/admin', async (req, res) => {
	const sections = await Section.findAll();
	if (isLoggedOn(res.locals.user)) {
		if (isAdmin(res.locals.user)) {
			res.render('pages/admin/section_adminpage.ejs', {
				sections,
				constants: headerConstants
			});
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
});

section.interface('/create', async (req, res) => {
	if (isLoggedOn(res.locals.user)) {
		if (isAdmin(res.locals.user)) {
			res.render('pages/admin/section_create.ejs', {
				constants: headerConstants
			});
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
});
