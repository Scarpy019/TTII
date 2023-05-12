
// TODO: Remove pls
import { Controller } from './BaseController.js';

const header = new Controller('header');

header.read = (req, res) => {
	res.set(['../pages/misc/header_val.json']);
};
