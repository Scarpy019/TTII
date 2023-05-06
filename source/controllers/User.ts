import { Op } from 'sequelize';
import { AuthToken, User } from '../models';
import { Controller } from './BaseController';
import { randomBytes } from 'crypto';
import { authorization as config } from '../config';

interface UserSigninForm {
	user: string;
	password: string;
};

function isUserSigninForm (obj: any): obj is UserSigninForm {
	const valid =
        ('user' in obj) &&
        typeof obj.user === 'string' &&
        (/[\w_]{4,}/.test(obj.user) ||
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(obj.user)) &&
        ('password' in obj) &&
        typeof obj.password === 'string' &&
        /[\w_!@#$%^&*]{6,}/.test(obj.password);
	return valid;
};

const user = new Controller('user');

user._read = (req, res) => {
	res.send('User main page');
};

const login = user.subcontroller('login');

login._read = (req, res) => {
	res.render('pages/user/login');
};

login.create = login.handler(
	// body validator
	isUserSigninForm,
	// handler
	async (req, res, next) => {
		try {
			const user = await User.findOne({
				where: {
					[Op.or]: [
						{ username: req.body.user },
						{ email: req.body.user }
					],
					password: req.body.password
				}
			});
			if (user != null) {
				const token = randomBytes(32).toString('hex');
				void AuthToken.create({
					authToken: token,
					userId: user.id
				}).then((_) => {
					res.cookie('authToken', token, { maxAge: config.tokenLifeBrowser, sameSite: 'strict', secure: true });
					res.send('Logged in successfuly');
				}).catch((error) => {
					res.send(error);
				});
			} else {
				res.send('User not found');
			}
		} catch (error) {
			res.send(error);
		}
	},
	// decliner
	(req, res) => {
		res.sendStatus(400);
	}
);
/*
login.create = async (req, res): Promise<void> => {
	if (isUserSigninForm(req.body)) {
		try {
			const user = await User.findOne({
				where: {
					[Op.or]: [
						{ username: req.body.user },
						{ email: req.body.user }
					],
					password: req.body.password
				}
			});
			if (user != null) {
				const token = randomBytes(32).toString('hex');
				void AuthToken.create({
					authToken: token,
					userId: user.id
				}).then((_) => {
					res.cookie('authToken', token, { maxAge: config.tokenLifeBrowser, sameSite: 'strict', secure: true });
					res.send('Logged in successfuly');
				}).catch((error) => {
					res.send(error);
				});
			} else {
				res.send('User not found');
			}
		} catch (error) {
			res.send(error);
		}
	} else {
		res.sendStatus(400);
	}
};
*/
