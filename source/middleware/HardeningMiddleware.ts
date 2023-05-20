import type { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { session as config } from '../config.js';
import jwt from 'jsonwebtoken';
import { logger } from '../lib/Logger.js';

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

/**
 * Express middleware for checking headers and the body for a valid CSRF token
 *
 * The header name is `x-csrf` and the body name is `__CSRFToken`
 */
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
		let CSRFtoken: string | undefined;
		/* Check CSRF */
		if (req.headers['x-csrf'] !== undefined) {
			// Checking if a CSRF token is added to the headers
			if (Array.isArray(req.headers['x-csrf'])) {
				CSRFtoken = req.headers['x-csrf'][0];
			} else {
				CSRFtoken = req.headers['x-csrf'];
			}
		} else {
			// If not, fall back to checking the body for a CSRF token
			CSRFtoken = req.body.__CSRFToken;
		}
		if (CSRFtoken === undefined || typeof CSRFtoken !== 'string') {
			// CSRF not found
			res.sendStatus(403);
		} else {
			try {
				const CSRFdata = jwt.verify(CSRFtoken, config.secret);
				if (typeof CSRFdata !== 'string' && CSRFdata.sub === res.locals.sessionId) {
					// token is valid
					next();
				} else {
					// token was not valid
					res.sendStatus(403);
				}
			} catch (e) {
				// jwt throws an error
				res.sendStatus(403);
			}
		}
	}
}

export async function obfuscateServerInfo (req: Request, res: Response, next: NextFunction): Promise<void> {
	res.removeHeader('X-Powered-By');
	next();
}
