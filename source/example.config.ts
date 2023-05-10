
export const db = {
	/** host name for the database */
	host: 'localhost',
	/** username for the database connection */
	user: 'mvc_server',
	/** password for the database connection */
	pass: 'password',
	/** database name for the app */
	db: 'db_name'
};
export const authorization = {
	/**  lifetime of the token in the browser in ms */
	tokenLifeBrowser: 172_800_000,

	/** lifetime of the token in the database in ms
    (should be shorter than browser to inform user that session has ended) */
	tokenLifeDatabase: 100_000_000,

	/** maximum age of the token in the database in days
	this should span several days for the user's convenience
	*/
	tokenAgeDatabase: 7
};
