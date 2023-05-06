import type { NextFunction, Request, Response, IRoute } from 'express';
import { Router } from 'express';

const router: Router = Router();

interface initializable {
	_init: () => void;
};
const controllers: initializable[] = [];

export function controllerRouter (): Router {
	controllers.forEach((controller) => { controller._init(); });
	return router;
};

export interface controlPathHandler<body=any, _ParamDict extends Record<string, string> = Record<string, string>,
	_customReq extends Request = Request<_ParamDict, any, body>,
	_fvoid extends ((req: _customReq, res: Response, next: NextFunction) => void) =
	((req: _customReq, res: Response, next: NextFunction) => void),
	_fpromiseVoid extends ((req: _customReq, res: Response, next: NextFunction) => Promise<void>) =
	((req: _customReq, res: Response, next: NextFunction) => Promise<void>),
	_func extends _fvoid | _fpromiseVoid = _fvoid | _fpromiseVoid,
	_method extends _func | _func[] = _func | _func[],
	_f_reject_void extends ((req: _customReq, res: Response) => void) =
	((req: _customReq, res: Response) => void),
	_f_reject_promiseVoid extends ((req: _customReq, res: Response) => Promise<void>) =
	((req: _customReq, res: Response) => Promise<void>),
	_func_reject extends _f_reject_void | _f_reject_promiseVoid = _f_reject_void | _f_reject_promiseVoid> {
	bodyvalidator: (body: any /* { [T in keyof body]?: any } */) => body is body;
	handler: _method;
	rejecter?: _func_reject;
};

export class Controller<const params extends readonly string[] = [],
	const optionals extends readonly string[] = [],
	const _ParamDict extends Record<string, string> = { [_ in params[number]]: string } &
	{ [_ in optionals[number]]?: string },
	_fvoid extends ((req: Request<_ParamDict>, res: Response, next: NextFunction) => void) =
	((req: Request<_ParamDict>, res: Response, next: NextFunction) => void),
	_fpromiseVoid extends ((req: Request<_ParamDict>, res: Response, next: NextFunction) => Promise<void>) =
	((req: Request<_ParamDict>, res: Response, next: NextFunction) => Promise<void>),
	_func extends _fvoid | _fpromiseVoid = _fvoid | _fpromiseVoid,
	_method extends _func | _func[] = _func | _func[]> {
	readonly name: string;
	readonly prefix: string;
	subcontrollers: initializable[] = [];
	constructor (name: string, params?: params, optionals?: optionals, _autoInit: boolean = true) {
		this.name = '/' + name;
		let prefix: string = '';
		if (params !== undefined) params.forEach((param) => { prefix += '/:' + param; });
		if (optionals !== undefined) optionals.forEach((optional) => { prefix += '/:' + optional + '?'; });
		this.prefix = prefix;
		if (_autoInit) controllers.push(this);
	}

	subcontroller<const n_params extends readonly string[] = [],
		const n_optionals extends readonly string[] = [],
		const n_ParamDict extends Record<string, string> = { [_ in n_params[number]]: string } & { [_ in n_optionals[number]]?: string }>
	(name: string, params?: n_params, optionals?: n_optionals): Controller<n_params, n_optionals, n_ParamDict> {
		const controller = new Controller<n_params, n_optionals, n_ParamDict>(this.name.substring(1) + '/' + name, params, optionals, false);
		this.subcontrollers.push(controller);
		return controller;
	}

	before: _method | controlPathHandler<any, _ParamDict> | null = null;

	create: _method | controlPathHandler<any, _ParamDict> | null = null;

	read: _method | controlPathHandler<any, _ParamDict> | null = null;

	update: _method | controlPathHandler<any, _ParamDict> | null = null;

	delete: _method | controlPathHandler<any, _ParamDict> | null = null;

	handler<body>(
		bodyvalidator: controlPathHandler<body, _ParamDict>['bodyvalidator'],
		handler: controlPathHandler<body, _ParamDict>['handler'],
		rejecter?: controlPathHandler<body, _ParamDict>['rejecter']): controlPathHandler<body, _ParamDict> {
		return {
			bodyvalidator,
			handler,
			rejecter
		};
	}

	private setroute (
		method: _method | controlPathHandler<any, _ParamDict> | null,
		route: IRoute,
		routeMethod: 'all' | 'get' | 'put' | 'delete' | 'post'): IRoute {
		if (method !== null) {
			if (Array.isArray(method)) {
				return route[routeMethod](...method);
				// route = route.all(...this.before);
			} else if (typeof method === 'function') {
				return route[routeMethod](method);
				// route = route.all(this.before);
			} else if (typeof method === 'object') {
				// small middleware that checks if the body is valid
				const validCheck = async (req: Request<_ParamDict>, res: Response, next: NextFunction): Promise<void> => {
					if (method.bodyvalidator(req.body)) {
						next();
					} else {
						if (method.rejecter !== undefined) {
							await method.rejecter(req, res);
						} else {
							res.sendStatus(400);
						}
					}
				};
				if (Array.isArray(method.handler)) {
					return route[routeMethod](validCheck, ...method.handler);
				} else if (typeof method.handler === 'function') {
					return route[routeMethod](validCheck, method.handler);
				}
			}
		}
		return route;
	}

	public _init (): void {
		// init subcontrollers to parse them before the main controller
		this.subcontrollers.forEach((subc) => { subc._init(); });

		let route = router.route(this.name + this.prefix);
		route = this.setroute(this.before, route, 'all');
		route = this.setroute(this.create, route, 'post');
		route = this.setroute(this.read, route, 'get');
		route = this.setroute(this.update, route, 'put');
		this.setroute(this.delete, route, 'delete');
		console.log('Controller at path %s initialized', this.name);
		/* TODO delete
		if (this.before !== null) {
			if (Array.isArray(this.before)) {
				route = route.all(...this.before);
			} else if (typeof this.before === 'function') {
				route = route.all(this.before);
			} else if (typeof this.before === 'object') {
				//
			}
		}
		if (this.create !== null) {
			if (Array.isArray(this.create)) {
				route = route.post(...this.create);
			} else if (typeof this.create === 'function') {
				route = route.post(this.create);
			} else if (typeof this.create === 'object') {
				//
			}
		}
		if (this.read !== null) {
			if (Array.isArray(this.read)) {
				route = route.get(...this.read);
			} else if (typeof this.read === 'function') {
				route = route.get(this.read);
			} else if (typeof this.read === 'object') {
				//
			}
		}
		if (this.update !== null) {
			if (Array.isArray(this.update)) {
				route = route.put(...this.update);
			} else if (typeof this.update === 'function') {
				route = route.put(this.update);
			} else if (typeof this.update === 'object') {
				//
			}
		}
		if (this.delete !== null) {
			if (Array.isArray(this.delete)) {
				route.get(...this.delete);
			} else if (typeof this.delete === 'function') {
				route.get(this.delete);
			} else if (typeof this.delete === 'object') {
				//
			}
		}
		*/
	}
};

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
