import { Section } from '../models/Section.js';
import { Subsection } from '../models/Subsection.js';
import { Controller } from './BaseController.js';

const subsection = new Controller('subsection', ['sectionId']);

subsection.read = async (req, res) => {
	const secId = Number(req.params.sectionId);
	if (!isNaN(secId)) {
		const section = await Section.findByPk(secId, { include: [Subsection] });
		if (section !== null) {
			res.render('pages/tt2_subcategory_skeleton.ejs', { section });
		}
	}
};
