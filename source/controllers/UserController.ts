import { Op } from 'sequelize';
import { Listing, User } from '../models/index.js';
import { Controller } from './BaseController.js';
import { authorization as config } from '../config.js';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { headerConstants } from './config.js';

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

user.read = (req, res) => {
	const user = res.locals.user;
	res.send(`User main page. Hello, ${user?.username ?? 'unknown'}!`); // TODO possibly delete?
};

const login = user.subcontroller('login');

login.read = (req, res) => {
	if (res.locals.user !== null && res.locals.user !== undefined) {
		res.redirect('/section');
	} else {
		let redirect = '';
		if (typeof req.query.redirect === 'string') {
			redirect = req.query.redirect;
		}
		res.render('pages/user/login', { redirect: Buffer.from(redirect, 'base64').toString('ascii'), constants: headerConstants });
	}
};

const userpage = user.subcontroller('profile', ['id']);

userpage.read = async (req, res) => {
	const userpageId = req.params.id;
	if (userpageId !== null && userpageId !== undefined) {
		const usernameVar = await User.findByPk(userpageId, { include: [Listing] });
		if (usernameVar !== null && usernameVar !== undefined) {
			const userlistings = await Listing.findAll({ where: { userId: usernameVar.id } });
			if (res.locals.user !== null && res.locals.user !== undefined) {
				const user: User = res.locals.user;
				if (user.id === userpageId) {
					if (res.locals.lang !== undefined) {
						res.render('pages/user/userpage.ejs', { username: `${res.locals.lang.userpage.welcome},${usernameVar.username}`, constants: headerConstants, userstatus_page: `/user/profile/${user.id}`, userstatus_name: user.username, userlistings, currentuserid: user.id, authorid: usernameVar.id });
					}
				}
				if (user.id !== userpageId) {
					res.render('pages/user/userpage.ejs', { username: usernameVar.username, constants: headerConstants, userstatus_page: `/user/profile/${user.id}`, userstatus_name: user.username, userlistings, currentuserid: user.id, authorid: 'abc' });
				}
			} else {
				res.render('pages/user/userpage.ejs', { username: usernameVar, constants: headerConstants, userstatus_page: '/user/login', userlistings, currentuserid: null, authorid: 'abc' });
			}
		}
	} else {
		res.redirect('/whoops');
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
			} else if (await bcrypt.compare(req.body.password, user.password)) {
				// successful login
				const payload: object = {
					sub: user.id
				};
				const token = jwt.sign(payload, config.secret, { expiresIn: config.tokenLifeBrowser });
				res.cookie('AuthToken', token, { maxAge: config.tokenLifeBrowser * 1000, sameSite: 'strict', secure: true });

				let redirectURL = '/';
				if (req.body.redirect !== undefined) {
					redirectURL = req.body.redirect;
				}
				console.log(redirectURL);
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
	if (res.locals.user !== null && res.locals.user !== undefined) {
		res.clearCookie('AuthToken');
		res.send('Logging out');
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
	if (res.locals.user !== null && res.locals.user !== undefined) {
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
