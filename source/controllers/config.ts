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
	Home: 'Home',
	searchbutton_name: 'Search',
	publishbutton_name: 'Publish'
};
