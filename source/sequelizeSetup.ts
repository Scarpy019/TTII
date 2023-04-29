import { Sequelize } from 'sequelize-typescript';
import {db as config} from './config';
import { sys } from 'typescript';
import { Bid, Listing, Section, Subsection, User, UserLog } from './models';

export const sequelize = new Sequelize({
  database: config.db,
  dialect: 'mysql',
  username: config.user,
  password: config.pass,
  host: config.host,
  models: [User, UserLog, Section, Subsection, Listing, Bid],
  define:{
    freezeTableName:true,
  },
});

// aliases for easier id type seperation 
export type UUID = string;
export type AutoId = number;

