import type { Request, Response, NextFunction, Application } from 'express';
import { type User, UserLog, type Log } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

async function logUserAction (req: Request, res: Response, next: NextFunction): Promise<void> {
	const REPLACE_ME: User | null = null; // TODO: replace this with res.locals.user when the authentification branch is merged into main
	if (REPLACE_ME !== null) {
		throw new Error('Not Implemented');
	} else {
		await UserLog.create({
			id: uuidv4(),
			log: { action: req.method, path: req.path } satisfies Log
		});
	}
	next();
}

export function applyLogging (app: Application): void {
	app.use(logUserAction);
}
