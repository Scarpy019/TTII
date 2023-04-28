import { Sequelize } from 'sequelize-typescript';
import {db as config} from './config';
import { sys } from 'typescript';
import { Listing, Section, Subsection, User, UserLog } from './models';

export const sequelize = new Sequelize({
  database: config.db,
  dialect: 'mysql',
  username: config.user,
  password: config.pass,
  host: config.host,
  models: [User, UserLog, Section, Subsection, Listing],
  define:{
    freezeTableName:true,
  },
});

