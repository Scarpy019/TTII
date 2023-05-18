import type { Request, Response, NextFunction } from 'express';
import ENG from '../localization/lang_en.js';
import LV from '../localization/lang_lv.js';
import type locale from '../localization/localization.js';

const localizations: Record<string, locale> = {
	ENG,
	LV
};

export function localization (req: Request, res: Response, next: NextFunction): void {
	const lang = req.cookies.lang;
	console.log(localizations);
	if (lang in localizations) {
		res.locals.lang = localizations[lang];
	} else {
		res.cookie('lang', 'LV');
		res.locals.lang = localizations.LV;
	}
	next();
}
