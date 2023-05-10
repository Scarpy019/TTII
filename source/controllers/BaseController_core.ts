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

type ThisOrArr<T> = T | T[];
type ThisOrAsync<T extends (...params: any) => void> = T | ((...params: Parameters<T>) => Promise<void>);

type ParameterDict<params extends readonly string[],
	optionals extends readonly string[]> =
	{ [_ in params[number]]: string } &
	{ [_ in optionals[number]]?: string };

type CustomRequest<dict extends Record<string, string>> =
	Request<dict>;

type CustomHandler<customRequest extends Request> = (req: customRequest, res: Response, next: NextFunction) => void;

type CustomMethod<handler extends CustomHandler<any>> = ThisOrArr<ThisOrAsync<handler>>;

type CustomFinalHandler<dict extends Record<string, string>> = (req: Request<dict>, res: Response) => void;

export interface BaseControlPathHandler<
	body=any,
	ParamDict extends Record<string, string> = Record<string, string>,
	_request extends Request = CustomRequest<ParamDict>> {
	bodyvalidator: (body: any) => body is body;
	handler: CustomMethod<CustomHandler<_request>>;
	rejecter?: CustomFinalHandler<ParamDict>;
};

export class BaseController<const params extends readonly string[] = [],
	const optionals extends readonly string[] = [],
	_paramDict extends Record<string, string> = ParameterDict<params, optionals>,
	_method extends CustomMethod<CustomHandler<Request<_paramDict>>> = CustomMethod<CustomHandler<Request<_paramDict>>>> {
	readonly name: string;
	readonly prefix: string;
	subcontrollers: initializable[] = [];
	/**
	 * Overriden by Controller's constructor
	 */
	constructor (name: string, params?: params, optionals?: optionals, _autoInit: boolean = true) {
		this.name = '/' + name;
		let prefix: string = '';
		if (params !== undefined) params.forEach((param) => { prefix += '/:' + param; });
		if (optionals !== undefined) optionals.forEach((optional) => { prefix += '/:' + optional + '?'; });
		this.prefix = prefix;
		if (_autoInit) controllers.push(this);
	}

	/**
	 * Generates a subcontroller appending itself to the end of this controllers name.
	 * !! Does not use the original controller's parameters !!
	 * @param name The base name of the controller
	 * @param params mandatory parameters
	 * @param optionals the optional parameters
	 */
	subcontroller<const n_params extends readonly string[] = [],
		const n_optionals extends readonly string[] = []>
	(name: string, params?: n_params, optionals?: n_optionals): BaseController<n_params, n_optionals> {
		const controller = new BaseController<n_params, n_optionals>(this.name.substring(1) + '/' + name, params, optionals, false);
		this.subcontrollers.push(controller);
		return controller;
	}

	before: _method | BaseControlPathHandler<any, _paramDict> | null = null;

	create: _method | BaseControlPathHandler<any, _paramDict> | null = null;

	read: _method | BaseControlPathHandler<any, _paramDict> | null = null;

	update: _method | BaseControlPathHandler<any, _paramDict> | null = null;

	delete: _method | BaseControlPathHandler<any, _paramDict> | null = null;

	handler<body>(
		bodyvalidator: BaseControlPathHandler<body, _paramDict>['bodyvalidator'],
		handler: BaseControlPathHandler<body, _paramDict>['handler'],
		rejecter?: BaseControlPathHandler<body, _paramDict>['rejecter']): BaseControlPathHandler<body, _paramDict> {
		return {
			bodyvalidator,
			handler,
			rejecter
		};
	}

	private setroute (
		method: _method | BaseControlPathHandler<any, _paramDict> | null,
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
				const validCheck = async (req: Request<_paramDict>, res: Response, next: NextFunction): Promise<void> => {
					if (method.bodyvalidator(req.body)) {
						next();
					} else {
						if (method.rejecter !== undefined) {
							method.rejecter(req, res);
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
	}
};
