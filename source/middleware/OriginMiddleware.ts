import type { Request, Response, NextFunction } from 'express';

export async function originURLMiddleware (req: Request, res: Response, next: NextFunction): Promise<void> {
	res.locals.originURL = '_';
	next();
}
