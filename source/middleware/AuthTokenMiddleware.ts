import type { Request, Response, NextFunction, Application } from 'express';
import { AuthToken, User } from '../models/index.js';

async function validateAuthToken (req: Request, res: Response, next: NextFunction): Promise<void> {
	console.log('Outside my balls!');
	if (req.cookies.AuthToken !== undefined) {
		const token = req.cookies.AuthToken;
		const tokenEntry = await AuthToken.findOne({
			where: {
				authToken: token
			},
			include: [User]
		});
		console.log('Inside my balls!');
		console.log(tokenEntry);
		console.log(tokenEntry !== null);
		console.log(tokenEntry !== null && Date.now() < tokenEntry.maxLife.getTime());
		console.log(tokenEntry !== null && Date.now() - tokenEntry.lastSeen.getTime() < tokenEntry.lifetime);

		if (tokenEntry !== null && // If the token even exists and...
			Date.now() < tokenEntry.maxLife.getTime() && // ...if the token has not exceeded its absolute maximum age and...
			Date.now() - tokenEntry.lastSeen.getTime() < tokenEntry.lifetime) { // ...if the token has not gone unseen for longer than its lifetime...
			// ...then the token is valid! :)
			if (tokenEntry.user === undefined) res.locals.user = null; // uh oh panic!!
			else res.locals.user = tokenEntry.user;
		} else {
			if (tokenEntry !== null) {
				// If the token is invalid, then delete it since we don't need it anymore.
				await tokenEntry.destroy();
			}
			res.locals.user = null; // Set the user local to undefined to inform further endpoints that the request is unauthenticated.
		}
	}
	next();
}

export function applyTokenAuthentification (app: Application): void {
	app.use(validateAuthToken);
}
