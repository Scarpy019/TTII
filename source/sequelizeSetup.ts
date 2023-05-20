import { Sequelize } from 'sequelize-typescript';
import { db as config } from './config.js';
import { Bid, Listing, Media, Section, Subsection, User, UserLog } from './models/index.js';
import { logger } from 'yatsl';

export const sequelize = new Sequelize({
	database: config.db,
	dialect: 'mysql',
	username: config.user,
	password: config.pass,
	host: config.host,
	models: [User, UserLog, Section, Subsection, Listing, Bid, Media],
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
