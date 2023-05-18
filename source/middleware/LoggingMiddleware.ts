import type { Request, Response, NextFunction } from 'express';
import { UserLog, type Log } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/Logger.js';

export function logUserAction (req: Request, res: Response, next: NextFunction): void {
	if (res.locals.user !== undefined && res.locals.user !== null) {
		logger.log(`User ${res.locals.user.username} made ${req.method} to ${req.path}!`);
		UserLog.create({
			id: uuidv4(),
			log: { action: req.method, path: req.path } satisfies Log,
			userId: res.locals.user?.id
		}).catch(e => logger.error('Exception occurred writing log to DB: ', e));
	} else {
		logger.log(`Anonymous made ${req.method} to ${req.path}!`);
		UserLog.create({
			id: uuidv4(),
			log: { action: req.method, path: req.path } satisfies Log
		}).catch(e => logger.error('Exception occurred writing log to DB: ', e));
	}
	next();
}
