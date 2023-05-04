import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
/* TODO remove:
import express = require('express');

const app: express.Application = express();
*/
export const controllerRouter: Router = Router();

export class Controller<const params extends readonly string[] = [],
	const optionals extends readonly string[] = [],
	const _ParamDict = { [_ in params[number]]: string } &
	{ [_ in optionals[number]]?: string }> {
	readonly name: string;
	readonly prefix: string;
	constructor (name: string, params?: params, optionals?: optionals) {
		this.name = '/' + name;
		let prefix: string = '';
		if (params !== undefined) params.forEach((param) => { prefix += '/:' + param; });
		if (optionals !== undefined) optionals.forEach((optional) => { prefix += '/:' + optional + '?'; });
		this.prefix = prefix;
	}

	subcontroller<const n_params extends readonly string[] = [],
		const n_optionals extends readonly string[] = [],
		const n_ParamDict = { [_ in n_params[number]]: string } & { [_ in n_optionals[number]]?: string }>
	(name: string, params?: n_params, optionals?: n_optionals): Controller<n_params, n_optionals, n_ParamDict> {
		return new Controller(this.name + '/' + name, params, optionals);
	}

	before: ((req: Request<_ParamDict>, res: Response, next: NextFunction) => void) |
	Array<((req: Request<_ParamDict>, res: Response, next: NextFunction) => void)> |
	null = null;

	create: ((req: Request<_ParamDict>, res: Response, next: NextFunction) => void) |
	Array<((req: Request<_ParamDict>, res: Response, next: NextFunction) => void)> |
	null = null;

	read: ((req: Request<_ParamDict>, res: Response, next: NextFunction) => void) |
	Array<((req: Request<_ParamDict>, res: Response, next: NextFunction) => void)> |
	null = null;

	update: ((req: Request<_ParamDict>, res: Response, next: NextFunction) => void) |
	Array<((req: Request<_ParamDict>, res: Response, next: NextFunction) => void)> |
	null = null;

	delete: ((req: Request<_ParamDict>, res: Response, next: NextFunction) => void) |
	Array<((req: Request<_ParamDict>, res: Response, next: NextFunction) => void)> |
	null = null;

	init (): void {
		console.log(this);
		let route = controllerRouter.route(this.name + this.prefix);
		if (this.before !== null) {
			if (Array.isArray(this.before)) {
				route = route.all(...this.before);
			} else {
				route = route.all(this.before);
			}
		}
		if (this.create !== null) {
			if (Array.isArray(this.create)) {
				route = route.post(...this.create);
			} else {
				route = route.post(this.create);
			}
		}
		if (this.read !== null) {
			if (Array.isArray(this.read)) {
				route = route.get(...this.read);
			} else {
				route = route.get(this.read);
			}
		}
		if (this.update !== null) {
			if (Array.isArray(this.update)) {
				route = route.put(...this.update);
			} else {
				route = route.put(this.update);
			}
		}
		if (this.delete !== null) {
			if (Array.isArray(this.delete)) {
				route.get(...this.delete);
			} else {
				route.get(this.delete);
			}
		}
	}
};

/* TODO: remove
const c = new Controller('pr', ['id', 'a241'], ['gg', '4ac']);

c.read = (req, res) => {
	console.log(req.params);
	console.log('hiii');
	res.send('hiii');
};

c.init();

app.use(controllerRouter);

app.listen(3000, async function () {
	console.log('App is listening on port 3000!');
});
*/
