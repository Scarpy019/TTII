import { type NextFunction, Router, type Response, type Request } from 'express';
import { AuthToken, User } from '../models';
import { authorization as config } from '../config';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { randomBytes } from 'crypto';

export const router = Router();

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
/**
 * Sign up route aka User.create
 * TODO: make passwords not be saved in plaintext
 */
router.post('/signup', (req, res) => {
	console.log(req.body);
	if (isUserSignupForm(req.body)) {
		void User.create({
			id: uuidv4(),
			access: 'Client',
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		}).then(() => {
			res.redirect('../');
		}).catch((error) => {
			res.send(error);
		});
	} else {
		res.sendStatus(400);
	}
});

router.get('/signup', (req, res) => {
	res.render('pages/user/signup');
});

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
/**
 * Log in route
 */
router.get('/login', (req, res) => {
	res.render('pages/user/login');
});

router.post('/login', (req, res) => {
	if (isUserSigninForm(req.body)) {
		void User.findOne({
			where: {
				[Op.or]: [
					{ username: req.body.user },
					{ email: req.body.user }
				],
				password: req.body.password
			}
		}).then((user) => {
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
		}).catch((error) => {
			res.send(error);
		});
	} else {
		res.sendStatus(400);
	}
});

export interface AuthenticatedRequest extends Request {
	user?: User | undefined;
};
/**
 * Middleware for verifying the auth token
 */
export async function authenticator (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
	try {
		console.log(req.cookies);
		if ('authToken' in req.cookies) {
			const authenticatedUser: User | undefined | null = (await AuthToken.findByPk(
				req.cookies.authToken,
				{
					include: [User]
				}
			))?.user;
			if (authenticatedUser !== undefined && authenticatedUser !== null) {
				req.user = authenticatedUser;
			} else {
				req.user = undefined;
			}
		}
	} catch (error) {
		req.user = undefined;
		console.log(error);
	} finally {
		next();
	}
};
