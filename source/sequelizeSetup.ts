import { Sequelize } from 'sequelize-typescript';
import { db as config } from './config.js';
import { Bid, ChatMessage, Listing, Media, MessageComponent, Section, Subsection, User, UserAccess, UserLog } from './models/index.js';
import { logger } from 'yatsl';
import { readFileSync } from 'fs';

const host = process.env.APP_DB_HOST !== undefined ? process.env.APP_DB_HOST : config.host;
const db = process.env.APP_DB !== undefined ? process.env.APP_DB : config.db;
const user = process.env.APP_DB_USER !== undefined ? process.env.APP_DB_USER : config.user;
const pass = process.env.APP_DB_PASSWORD_FILE !== undefined ? readFileSync(process.env.APP_DB_PASSWORD_FILE).toString() : config.pass; // If the variable is defined, this is a docker compose environment, meaning we should read the password from the environment

export const sequelize = new Sequelize({
	database: db,
	dialect: 'mysql',
	username: user,
	password: pass,
	host,
	port: 3306,
	models: [UserAccess, User, UserLog, Section, Subsection, Listing, Bid, Media, ChatMessage, MessageComponent],
	define: {
		freezeTableName: true
	},
	logging: (sql: string) => {
		logger.overrideConfig({
			name: 'sequelize',
			logLine: false
		});
		logger.log(sql);
	}
});

// aliases for easier id type seperation
export type UUID = string;
export type AutoId = number;
