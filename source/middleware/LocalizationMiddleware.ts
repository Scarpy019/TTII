import type { Request, Response, NextFunction } from 'express';
import en from '../localization/en.js';
import lv from '../localization/lv.js';
import type locale from '../localization/localization.js';

const localizations: Record<string, locale> = {
	en,
	lv
};

export function localization (req: Request, res: Response, next: NextFunction): void {
	const lang = req.cookies.lang;
	console.log(localizations);
	if (lang in localizations) {
		res.locals.lang = localizations[lang];
	} else {
		res.cookie('lang', 'lv');
		res.locals.lang = localizations.lv;
	}
	next();
}
