import type { Request, Response, NextFunction } from 'express';
import { UserLog, type Log } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export async function logUserAction (req: Request, res: Response, next: NextFunction): Promise<void> {
	if (res.locals.user !== null) {
		await UserLog.create({
			id: uuidv4(),
			log: { action: req.method, path: req.path } satisfies Log,
			userId: res.locals.user?.id
		});
	} else {
		await UserLog.create({
			id: uuidv4(),
			log: { action: req.method, path: req.path } satisfies Log
		});
	}
	next();
}
