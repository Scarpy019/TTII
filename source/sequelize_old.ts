import { Sequelize } from 'sequelize-typescript';
import {db as config} from './config';

/**
 * Instance of the sequelize connection all models use
 */
export let sequelize = new Sequelize({
    database:config.db,
    username:config.user,
    password:config.pass,
    dialect:'mysql',
    host:config.host
});
