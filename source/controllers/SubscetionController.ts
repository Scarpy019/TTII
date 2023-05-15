import { Section } from '../models/Section.js';
import { Subsection } from '../models/Subsection.js';
import { type User } from '../models/User.js';
import { Controller } from './BaseController.js';

const subsection = new Controller('subsection', ['sectionId']);

subsection.read = async (req, res) => {
	const secId = Number(req.params.sectionId);
	if (!isNaN(secId)) {
		const section = await Section.findByPk(secId, { include: [Subsection] });
		if (section !== null) {
			if (res.locals.user !== null && res.locals.user !== undefined) {
				const user: User = res.locals.user;
				res.render('pages/main/subcategory_list.ejs', { section, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: `/user/${user.id}` });
			} else {
				res.render('pages/main/subcategory_list.ejs', { section, constants: headerConstants });
			}
		}
	}
};
