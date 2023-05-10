import { Op } from 'sequelize';
import { AuthToken, User } from '../models/index.js';
import { Controller } from './BaseController.js';
import { randomBytes } from 'crypto';
import { authorization as config } from '../config.js';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

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

user.read = (req, res) => {
	const user = res.locals.user;
	res.send(`User main page. Hello, ${user?.username ?? 'unknown'}!`);
};

const login = user.subcontroller('login');

login.read = (req, res) => {
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
					]
				}
			});
			if (user != null && await bcrypt.compare(req.body.password, user.password)) {
				const token = randomBytes(32).toString('hex');
				void AuthToken.create({
					authToken: token,
					userId: user.id
				}).then((_) => {
					res.cookie('AuthToken', token, { maxAge: config.tokenLifeBrowser, sameSite: 'strict', secure: true });
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

interface UserSignupForm {
	username: string;
	email: string;
	password: string;
};
function isUserSignupForm (obj: any): obj is UserSignupForm {
	const valid =
        ('username' in obj) &&
        typeof obj.username === 'string' &&
        /[\w_]{4,}/.test(obj.username) &&
        ('email' in obj) &&
        typeof obj.username === 'string' &&
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(obj.email) &&
        ('password' in obj) &&
        typeof obj.password === 'string' &&
        /[\w_!@#$%^&*]{6,}/.test(obj.password);

	return valid;
};

const signup = user.subcontroller('signup');

signup.read = (req, res): void => {
	res.render('pages/user/signup');
};

signup.create = signup.handler(
	isUserSignupForm,
	async (req, res): Promise<void> => {
		try {
			const hash = await bcrypt.hash(req.body.password, 12);
			await User.create({
				id: uuidv4(),
				access: 'Client',
				email: req.body.email,
				username: req.body.username,
				password: hash
			});
			res.redirect('../');
		} catch (error) {
			res.send(error);
		};
	}
);
