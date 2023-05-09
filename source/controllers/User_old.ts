import { type Response, Router, type Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthToken, User } from '../models/index.js';
import { randomBytes } from 'crypto';
import { Op } from 'sequelize';
import { authorization as config } from '../config.js';

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
export const UserController: Router = Router();

UserController.route('/signup')
	.get((req: Request, res: Response): void => {
		res.render('pages/user/signup');
	})
	.post(async (req: Request, res: Response): Promise<void> => {
		console.log(req.body);
		if (isUserSignupForm(req.body)) {
			try {
				await User.create({
					id: uuidv4(),
					access: 'Client',
					email: req.body.email,
					username: req.body.username,
					password: req.body.password
				});
				res.redirect('../');
			} catch (error) {
				res.send(error);
			};
		} else {
			res.sendStatus(400);
		}
	});

UserController.route('/login')
	.get((req: Request, res: Response): void => {
		res.render('pages/user/login');
	})
	.post(async (req: Request, res: Response): Promise<void> => {
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
	});
