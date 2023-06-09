import { Op } from 'sequelize';
import { Listing, User } from '../models/index.js';
import { Controller } from './BaseController.js';
import { authorization as config } from '../config.js';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { headerConstants } from './config.js';
import { doesUserExist, isLoggedOn } from '../middleware/ObjectCheckingMiddleware.js';

interface UserSigninForm {
	user: string;
	password: string;
	/**
	 * Base64 encoded URL
	 */
	redirect: string;
};

function isUserSigninForm (obj: any): obj is UserSigninForm {
	const valid =
        ('user' in obj) &&
        typeof obj.user === 'string' &&
        (/[\w_]{4,}/.test(obj.user) ||
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(obj.user)) &&
        ('password' in obj) &&
        typeof obj.password === 'string' &&
        /[\w_!@#$%^&*]{6,}/.test(obj.password) &&
		('redirect' in obj) &&
        typeof obj.redirect === 'string';
	return valid;
};

const user = new Controller('user');

const login = user.subcontroller('login');

login.read = (req, res) => {
	if (isLoggedOn(res.locals.user)) {
		res.redirect('/section');
	} else {
		let redirect = '';
		if (typeof req.query.redirect === 'string') {
			redirect = req.query.redirect;
		}
		res.render('pages/user/login', { redirect: Buffer.from(redirect, 'utf8').toString('base64'), constants: headerConstants });
	}
};

user.override('update', '/user/ban_or_unban');

user.update = async (req, res) => {
	const newstatus = req.body.status;
	const targetuserid = req.body.targetuser;
	const target = await User.findByPk(targetuserid);
	if (doesUserExist(target) && isLoggedOn(res.locals.user) && res.locals.user.accesslevel.ban_user) {
		if (newstatus === 'ban') {
			target.banned = true;
		} else if (newstatus === 'unban') {
			target.banned = false;
		}
		await target.save();
		res.redirect(`/user/profile/${target.username}`);
	}
};

const userpage = user.subcontroller('profile', ['username']);

userpage.read = async (req, res) => {
	const URLusername = req.params.username;
	if (URLusername !== null && URLusername !== undefined) {
		const usernameVar = await User.findOne({ where: { username: URLusername } });
		if (doesUserExist(usernameVar)) {
			const userlistings = await Listing.findAll({ where: { userId: usernameVar.id } });
			if (usernameVar.banned) {
				if (isLoggedOn(res.locals.user) && res.locals.user.accesslevel.ban_user) { // User is logged on and has ban user permissions || Only admins can access baned userpages
					res.render('pages/user/userpage.ejs', {
						username: usernameVar.username,
						constants: headerConstants,
						userlistings,
						authorid: usernameVar.id,
						authorbanstatus: usernameVar.banned
					});
				} else { // Non admins get redirected to section
					res.redirect('/section');
				}
			} else {
				res.render('pages/user/userpage.ejs', { // Sends all userpage information which gets compared with local user in the ejs file for personal userpage display
					username: usernameVar.username,
					constants: headerConstants,
					userlistings,
					authorid: usernameVar.id,
					authorbanstatus: usernameVar.banned,
					originURL: `_user_profile_${usernameVar.username}`
				});
			}
		} else {
			res.sendStatus(404);
		}
	}
};

// generates an auth token
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
			if (user == null) {
				res.send('User not found');
			} else if (user.banned) { // Checks if attempted login user is banned
				res.send('User is banned');
			} else if (await bcrypt.compare(req.body.password, user.password)) {
				// successful login
				const payload: object = {
					sub: user.id
				};
				const token = jwt.sign(payload, config.secret, { expiresIn: config.tokenLifeBrowser });
				res.cookie('AuthToken', token, { maxAge: config.tokenLifeBrowser * 1000, sameSite: 'strict', secure: true });

				let redirectURL = '/';
				if (req.body.redirect !== undefined) {
					// redirectURL = req.body.redirect;
					redirectURL = Buffer.from(req.body.redirect, 'base64').toString('utf8');
					while (redirectURL.includes('_')) {
						redirectURL = redirectURL.replace('_', '/');
					}
				}
				res.redirect(redirectURL);
				// res.send('Logged in successfully');
			} else {
				res.send('Password does not match username');
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

login.delete = (req, res) => {
	if (isLoggedOn(res.locals.user)) {
		res.clearCookie('AuthToken');
		res.redirect('/section');
	} else {
		res.send('Not Logged in');
	}
};

login.override('delete', '/signout');

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
	if (isLoggedOn(res.locals.user)) {
		res.redirect('/section');
	} else {
		res.render('pages/user/signup', { constants: headerConstants });
	}
};

signup.create = signup.handler(
	isUserSignupForm,
	async (req, res): Promise<void> => {
		try {
			const hash = await bcrypt.hash(req.body.password, 12);
			const user = await User.create({
				id: uuidv4(),
				access: 'client',
				email: req.body.email,
				username: req.body.username,
				password: hash
			});
			// successful signup
			const payload: object = {
				sub: user.id
			};
			const token = jwt.sign(payload, config.secret, { expiresIn: config.tokenLifeBrowser });
			res.cookie('AuthToken', token, { maxAge: config.tokenLifeBrowser * 1000, sameSite: 'strict', secure: true });
			res.redirect('../');
		} catch (error) {
			res.send(error);
		};
	}
);
