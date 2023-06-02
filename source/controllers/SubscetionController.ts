import { headerConstants } from './config.js';
import { Section } from '../models/Section.js';
import { Subsection } from '../models/Subsection.js';
import { type User } from '../models/User.js';
import { Controller } from './BaseController.js';
import { isAdmin, isLoggedOn } from '../middleware/AdminCheckMiddleware.js';
import { logger } from 'yatsl';

const subsection = new Controller('subsection', ['sectionId']);

subsection.read = async (req, res) => {
	const secId = Number(req.params.sectionId);
	if (!isNaN(secId)) {
		const section = await Section.findByPk(secId, { include: [Subsection] });
		if (section !== null) {
			if (isLoggedOn(res.locals.user)) {
				const user: User = res.locals.user;
				res.render('pages/main/subcategory_list.ejs', { section, constants: headerConstants, userstatus_name: user.username, userstatus_page: `/user/profile/${user.id}`, useraccess: user.access });
			} else {
				res.render('pages/main/subcategory_list.ejs', { section, constants: headerConstants, useraccess: 'slikti' });
			}
		} else {
			res.sendStatus(404);
		}
	}
};

interface SubsectionCreateForm {
	subsection_name: string;
	section_id: string;
};

interface SubectionEditForm {
	subsection_name: string;
	section_id: string;
	subsection_id: string;
};

function ValidsubsectionCreateForm (obj: any): obj is SubsectionCreateForm {
	const valid = ('subsection_name' in obj) && typeof obj.subsection_name === 'string' && ('section_id' in obj) && typeof obj.section_id === 'string' && !isNaN(Number(obj.section_id));
	return valid;
};

function ValidsubsectionUpdateForm (obj: any): obj is SubectionEditForm {
	const valid = ('subsection_name' in obj) && typeof obj.subsection_name === 'string' && ('section_id' in obj) && typeof obj.section_id === 'string' && ('subsection_id' in obj) && typeof obj.subsection_id === 'string' && !isNaN(Number(obj.section_id)) && !isNaN(Number(obj.subsection_id));
	return valid;
};

subsection.create = [
	async (req, res): Promise<void> => {
		if (ValidsubsectionCreateForm(req.body)) {
			try {
				if (isLoggedOn(res.locals.user)) {
					if (isAdmin(res.locals.user)) {
						await Subsection.create({
							name: req.body.subsection_name,
							sectionId: Number(req.body.section_id)
						});
					} else {
						res.sendStatus(404);
					}
				} else {
					res.sendStatus(404);
				}
				res.redirect(`/subsection/${req.body.section_id}`);
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

subsection.update = subsection.handler(
	ValidsubsectionUpdateForm,
	async (req, res): Promise<void> => {
		if (isLoggedOn(res.locals.user)) {
			if (isAdmin(res.locals.user)) {
				try {
					const subsectioninstance = await Subsection.findByPk(req.body.subsection_id);
					if (subsectioninstance !== null) {
						subsectioninstance.name = req.body.subsection_name;
						await subsectioninstance.save();
						res.redirect(`/subsection/${req.body.section_id}`);
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

subsection.delete = async (req, res) => {
	const subsectionId = req.body.subsec_id;
	if (subsectionId !== null && subsectionId !== undefined && isLoggedOn(res.locals.user)) {
		if (isAdmin(res.locals.user)) {
			const subsectionrow = await Subsection.findByPk(subsectionId);
			if (subsectionrow !== undefined && subsectionrow !== null) {
				const section = subsectionrow.sectionId;
				if (section !== undefined) {
					await subsectionrow.destroy();
					res.redirect(`/subsection/${section}`);
				} else {
					res.sendStatus(404);
				}
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

subsection.override('delete', '/subsection/delete');
subsection.override('update', '/subsection/update');

subsection.interface('/edit', async (req, res) => {
	const subsecId = String(req.query.subsectionId);
	const sectionId = String(req.params.sectionId);
	if (isLoggedOn(res.locals.user)) {
		if (isAdmin(res.locals.user)) {
			const subsection = await Subsection.findByPk(subsecId);
			const section = await Section.findByPk(sectionId);
			if (subsection !== null && section !== null) {
				res.render('pages/admin/subsection_edit.ejs', { sectionname: section.name, secId: section.id, oldsubsectionname: subsection.name, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/profile/${res.locals.user.id}`, useraccess: res.locals.user.access });
			} else {
				res.sendStatus(404);
			}
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
});

subsection.interface('/admin', async (req, res) => {
	const secId = (req.params.sectionId) as unknown;
	if (!isNaN(Number(secId)) && typeof secId === 'string') {
		const section = await Section.findByPk(secId, { include: [Subsection] });
		if (isLoggedOn(res.locals.user)) {
			if (isAdmin(res.locals.user)) {
				res.render('pages/admin/subsection_adminpage.ejs', { section, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/profile/${res.locals.user.id}`, useraccess: res.locals.user.access });
			} else {
				res.sendStatus(404);
			}
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
});

subsection.interface('/create', async (req, res) => {
	const secId = (req.params.sectionId);
	const section = await Section.findByPk(secId, { include: [Subsection] });
	if (isLoggedOn(res.locals.user) && section !== null) {
		if (isAdmin(res.locals.user)) {
			res.render('pages/admin/subsection_create.ejs', { sectionId: secId, sectionname: section.name, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/profile/${res.locals.user.id}`, useraccess: res.locals.user.access });
		} else {
			res.sendStatus(404);
		}
	} else {
		res.sendStatus(404);
	}
});
