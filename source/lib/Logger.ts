import { Logger } from 'yatsl';
import { logging as config } from '../config.js';

export const logger = new Logger({
	minLevel: config.logLevel
});
