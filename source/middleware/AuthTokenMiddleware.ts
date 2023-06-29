import type { Request, Response, NextFunction } from 'express';
import { User, UserAccess } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { authorization as config } from '../config.js';

export async function validateAuthToken (req: Request, res: Response, next: NextFunction): Promise<void> {
	res.locals.user = null;
	if (req.cookies.AuthToken !== undefined) {
		const token = req.cookies.AuthToken;
		try {
			const decoded = jwt.verify(token, config.secret, { clockTimestamp: Date.now() / 1000 }); // jsonwebtoken automatically verifies the specified time as well
			if (typeof decoded !== 'string') {
				if (decoded.sub !== null) {
					const user = await User.findOne({
						where: {
							id: decoded.sub
						},
						include: [UserAccess]
					});
					res.locals.user = user;
				}
			}
		} catch {
			// Clear the cookie just in case
			res.clearCookie('AuthToken');
		}
	}
	next();
}
