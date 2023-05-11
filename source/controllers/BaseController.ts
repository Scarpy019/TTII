import { BaseController, type BaseControlPathHandler } from './BaseController_core.js';
export { controllerRouter } from './BaseController_core.js';
/**
 * A handler that can be used to type check the body.
 */
export type controlPathHandler<
	body = any,
	paramDict extends Record<string, string> = Record<string, string>> =
	BaseControlPathHandler<body, paramDict>;

/**
 * The controller class.
 * Params are the mandatory parameters appended to the url in that order
 * Optionals are optional parameters appended to the end of that
 */
export class Controller<const params extends readonly string[] = [], const optionals extends readonly string[] = []>
	extends BaseController<params, optionals> {
	/**
	 * Controller that attaches itself to the controllerRouter
	 * @param name The base name of the controller
	 * @param params mandatory parameters
	 * @param optionals the optional parameters
	 */
	constructor (name: string, params?: params, optionals?: optionals) {
		super(name, params, optionals, true);
	}
};
