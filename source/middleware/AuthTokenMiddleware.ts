import type { Request, Response, NextFunction, Application } from 'express';
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { authorization as config } from '../config.js';

async function validateAuthToken (req: Request, res: Response, next: NextFunction): Promise<void> {
	res.locals.user = null;
	if (req.cookies.AuthToken !== undefined) {
		const token = req.cookies.AuthToken;
		const decoded = jwt.verify(token, config.secret, { clockTimestamp: Date.now() / 1000 }); // jsonwebtoken automatically verifies the specified time as well
		if (typeof decoded !== 'string') {
			if (decoded.sub !== null) {
				const user = await User.findOne({
					where: {
						id: decoded.sub
					}
				});
				res.locals.user = user;
			}
		}
	}
	next();
}

export function applyTokenAuthentification (app: Application): void {
	app.use(validateAuthToken);
}
