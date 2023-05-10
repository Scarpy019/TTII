import { BaseController, type BaseControlPathHandler } from './BaseController_core.js';
export { controllerRouter } from './BaseController_core.js';
export type controlPathHandler<
	body = any,
	paramDict extends Record<string, string> = Record<string, string>> =
	BaseControlPathHandler<body, paramDict>;
export class Controller<const params extends readonly string[] = [], const optionals extends readonly string[] = []>
	extends BaseController<params, optionals> {};
// TODO remove:
/*
// eslint-disable-next-line import/first
import express = require('express');

const app: express.Application = express();

const c = new Controller('pr', ['id', 'a241'], ['gg', '4ac']);

c.read = (req, res) => {
	console.log(req.params);
	console.log('hiii');
	res.send('hiii');
};

const d = c.subcontroller('pr', ['id', 'a241'], ['gg', '4ac']);

d.read = (req, res) => {
	res.send(req.params);
};
app.use(controllerRouter());

app.listen(3000, async function () {
	console.log('App is listening on port 3000!');
});
*/
