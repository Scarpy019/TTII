
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
	/**  lifetime of the token in the browser in s */
	tokenLifeBrowser: 172_800,

	/** secret used to sign JWTs and HMACs */
	secret: 'Please change me :)'
};
