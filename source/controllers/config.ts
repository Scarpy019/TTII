/**
 * A config module containing some constants for ease of use in controllers and
 * templates
 */

// TODO: integrate into generating controllers to follow DRY
/**
 * Controller names
 */
export const controllers = {
	section: 'section',
	subsection: 'subsection',
	user: 'user',
	listing: 'listing'
};

// TODO: integrate into generating controllers to follow DRY
/**
 * Hrefs for use in templates.
 */
export const hrefs: Record<string, string> = {
	section: '/section',
	search: '/search',
	publish: '/publish',
	subsection: '/subsection',
	user: '/user'
};

/**
 * Some template constants for headers
 */
export const headerConstants = {
	home_button: 'Home',
	search_button: 'Search',
	publish_button: 'Create Listing',
	pagetitle: 'Generic page title',
	section: '/section',
	search: '/search',
	publish: '/listing/create',
	subsection: '/subsection',
	user: '/user',
	signouthref: '/user/signout',
	signinhref: '/user/login',
	signuphref: '/user/signup',
	signout_name: 'Sign Out',
	login_name: 'Login',
	signup_name: 'Sign up'
};
