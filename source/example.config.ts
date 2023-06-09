import { LogLevel } from 'yatsl';

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
export const session = {
	/** lifetime of the session id token in the browser */
	tokenLife: 90_000,

	/** secret used to sign JWTs and HMACs */
	secret: authorization.secret // It can be the same as auth secret I think
};
export const logging = {
	/** Minimum log level */
	logLevel: LogLevel.INFO
};
export const server = {
	/** Whether or not this is debug */
	debug: false,
	/** HTTPS key location */
	keyLocation: 'server.key',
	/** HTTPS cert location */
	certLocation: 'server.cert'
};
export const seeder = {
	/* Admin password for the seeder */
	adminPass: 'sample_password'
};
export const auctions = {
	/* How often to check whether an auction has ended */
	auctionResolution: 30_000
};
