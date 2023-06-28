import { LogLevel } from 'yatsl';

export const db = {
	/** host name for the database */
	host: 'mysqldb',
	/** username for the database connection */
	user: 'root',
	/** password for the database connection */
	pass: 'root',
	/** database name for the app */
	db: 'timeklis_2'
};
export const authorization = {
	/**  lifetime of the token in the browser in s */
	tokenLifeBrowser: 172_800,

	/** secret used to sign JWTs and HMACs */
	secret: 'noslepums_noslepums'
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
