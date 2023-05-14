import type { NextFunction, Request, Response, IRoute } from 'express';
import { Router } from 'express';
const router: Router = Router();

interface initializable {
	_init: () => void;
};
const controllers: initializable[] = [];

export function controllerRouter (): Router {
	console.log('Routing...');
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

type httpmethod = 'get' | 'post' | 'put' | 'delete' | 'all';
type crud = 'create' | 'read' | 'update' | 'delete';
type url = `/${string}`;
type ControllerEndpoint = crud | url;

export interface BaseControlPathHandler<
	body=any,
	ParamDict extends Record<string, string> = Record<string, string>,
	_request extends Request = CustomRequest<ParamDict>> {
	bodyvalidator: (body: any) => body is body;
	handler: CustomMethod<CustomHandler<_request>>;
	rejecter?: CustomFinalHandler<ParamDict>;
};

type ControllerHandler<params extends Record<string, string>> = CustomMethod<CustomHandler<Request<params>>>;
type ControllerSmartHandler<params extends Record<string, string>> = BaseControlPathHandler<any, params>;

export class BaseController<const params extends readonly string[] = [],
	const optionals extends readonly string[] = [],
	parameterDictionary extends Record<string, string> = ParameterDict<params, optionals>,
	handler extends ControllerHandler<parameterDictionary> = ControllerHandler<parameterDictionary>> {
	readonly name: string;
	readonly prefix: string;
	private readonly subcontrollers: initializable[] = [];
	private readonly interfaces: Array<{ name: string; method: handler | BaseControlPathHandler<any, parameterDictionary> }> = [];
	private readonly overrides: { [T in ControllerEndpoint]?: url } = {};
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

	/**
	 * Called before all other methods( excluding interfaces )
	 */
	before: handler | ControllerSmartHandler<parameterDictionary> | null = null;

	/**
	 * Called on POST request
	 *
	 * This can be a function, a list of functions, similar to how express operates,
	 * or an object with added properties foor body type guarding.
	 */
	create: handler | ControllerSmartHandler<parameterDictionary> | null = null;

	/**
	 * Called on GET request
	 *
	 * This can be a function, a list of functions, similar to how express operates,
	 * or an object with added properties foor body type guarding.
	 */
	read: handler | ControllerSmartHandler<parameterDictionary> | null = null;

	/**
	 * Called on PUT request
	 *
	 * This can be a function, a list of functions, similar to how express operates,
	 * or an object with added properties foor body type guarding.
	 */
	update: handler | ControllerSmartHandler<parameterDictionary> | null = null;

	/**
	 * Called on DELETE request
	 *
	 * This can be a function, a list of functions, similar to how express operates,
	 * or an object with added properties foor body type guarding.
	 */
	delete: handler | ControllerSmartHandler<parameterDictionary> | null = null;

	handler<body>(
		bodyvalidator: BaseControlPathHandler<body, parameterDictionary>['bodyvalidator'],
		handler: BaseControlPathHandler<body, parameterDictionary>['handler'],
		rejecter?: BaseControlPathHandler<body, parameterDictionary>['rejecter']): BaseControlPathHandler<body, parameterDictionary> {
		return {
			bodyvalidator,
			handler,
			rejecter
		};
	}

	/**
	 * Constructs an interface and makes it available through `/Controller.name/name/...parameters`
	 * It is prioritized over parameterized CRUD methods, but not prioritized over subcontrollers
	 * @param name The url suffix to append the name to for running this interface
	 * @param handler The handler that is responsible for serving this interface
	 */
	interface (name: url, handler: handler | ControllerSmartHandler<parameterDictionary>): void {
		this.interfaces.push({ name, method: handler });
	}

	/**
	 * Overrides the default route of CRUD functions or interfaces
	 * @param url The url that the handler is associated with.
	 * @param name The name of the handler
	 */
	override (name: ControllerEndpoint, url: url): void {
		this.overrides[name] = url;
	}

	private setroute (
		method: handler | ControllerSmartHandler<parameterDictionary> | null,
		route: IRoute,
		routeMethod: httpmethod): IRoute {
		if (method !== null) {
			if (Array.isArray(method)) {
				return route[routeMethod](...method);
				// route = route.all(...this.before);
			} else if (typeof method === 'function') {
				return route[routeMethod](method);
				// route = route.all(this.before);
			} else if (typeof method === 'object') {
				// small middleware that checks if the body is valid
				const validCheck = async (req: Request<parameterDictionary>, res: Response, next: NextFunction): Promise<void> => {
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
		// init subcontrollers to parse them before the main controller to prevent parameters from being priority
		this.subcontrollers.forEach((subc) => { subc._init(); });

		console.log('\n\nInitializing %s\n---------------------------------', this.name);
		// init controller interfaces
		this.interfaces.forEach(Iface => {
			// handle the case where name is written with the slash
			const urlCheck = (x: string): x is url => {
				return x[0] === '/';
			};
			if (Iface.name[0] !== '/') Iface.name = '/' + Iface.name;
			if (urlCheck(Iface.name)) {
				let routeURL: string;

				// Overrides
				if (Iface.name in this.overrides) {
					routeURL = this.overrides[Iface.name] + this.prefix;
				} else {
					routeURL = this.name + Iface.name + this.prefix;
				}
				let r = router.route(routeURL);
				r = this.setroute(this.before, r, 'all');
				this.setroute(Iface.method, r, 'get');
				console.log('Controller interface at %s initialized\n', routeURL);
			}
		});
		// CRUD routing
		let route = router.route(this.name + this.prefix);

		route = this.setroute(this.before, route, 'all');

		console.log('Initializing CRUD methods');

		// create
		if (this.overrides.create !== undefined) {
			// different route for overrides, including before method
			console.log('%s create overriden to %s', this.name, this.overrides.create);
			let r = router.route(this.overrides.create as string);
			r = this.setroute(this.before, r, 'all');
			this.setroute(this.create, r, 'post');
		} else route = this.setroute(this.create, route, 'post');

		// read
		if (this.overrides.read !== undefined) {
			// different route for overrides, including before method
			console.log('%s read overriden to %s', this.name, this.overrides.read);
			let r = router.route(this.overrides.read as string);
			r = this.setroute(this.before, r, 'all');
			this.setroute(this.read, r, 'get');
		} else route = this.setroute(this.read, route, 'get');

		// update
		if (this.overrides.update !== undefined) {
			// different route for overrides, including before method
			console.log('%s update overriden to %s', this.name, this.overrides.update);
			let r = router.route(this.overrides.update as string);
			r = this.setroute(this.before, r, 'all');
			this.setroute(this.update, r, 'put');
		} else route = this.setroute(this.update, route, 'put');

		// delete
		if (this.overrides.delete !== undefined) {
			// different route for overrides, including before method
			console.log('%s delete overriden to %s', this.name, this.overrides.delete);
			let r = router.route(this.overrides.delete as string);
			r = this.setroute(this.before, r, 'all');
			this.setroute(this.delete, r, 'delete');
		} else this.setroute(this.delete, route, 'delete');
		console.log('CRUD initialized.\n');
	}
};
