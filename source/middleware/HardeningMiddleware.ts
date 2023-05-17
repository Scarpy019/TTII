import type { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { session as config } from '../config.js';
import jwt from 'jsonwebtoken';

export async function identifySession (req: Request, res: Response, next: NextFunction): Promise<void> {
	if (req.cookies.SessionId === undefined) {
		const sessionId = randomBytes(32).toString('hex');
		res.cookie('SessionId', sessionId, { maxAge: config.tokenLife * 1000, sameSite: 'strict', secure: true });
		res.locals.sessionId = sessionId;
	} else {
		res.locals.sessionId = req.cookies.SessionId;
	}
	next();
}

export async function validateCSRF (req: Request, res: Response, next: NextFunction): Promise<void> {
	if (res.locals.sessionId === undefined) {
		res.sendStatus(400);
	} else if (req.method === 'GET') {
		/* Generate CSRF */
		const payload: object = {
			sub: res.locals.sessionId
		};
		const CSRFtoken = jwt.sign(payload, config.secret, { expiresIn: config.tokenLife });
		res.cookie('CSRFToken', CSRFtoken, { maxAge: config.tokenLife * 1000, sameSite: 'strict', secure: true });
		next();
	} else {
		/* Check CSRF */
		const CSRFtoken = req.body.__CSRFToken;
		if (CSRFtoken === undefined || typeof CSRFtoken !== 'string') {
			res.sendStatus(403);
		} else {
			try {
				const CSRFdata = jwt.verify(CSRFtoken, config.secret);
				if (typeof CSRFdata !== 'string' && CSRFdata.sub === res.locals.sessionId) {
					next();
				} else {
					res.sendStatus(403);
				}
			} catch (e) {
				res.sendStatus(403);
			}
		}
	}
}

export async function obfuscateServerInfo (req: Request, res: Response, next: NextFunction): Promise<void> {
	res.removeHeader('X-Powered-By');
	next();
}
