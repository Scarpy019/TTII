
import BodyParser from 'body-parser';
import express from 'express';// Create a new express app instance
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { sequelize } from './sequelizeSetup.js';
import { controllerRouter } from './controllers/index.js';
import { applyLogging } from './middlewares/LoggingMiddleware.js';
import { validateAuthToken } from './middleware/AuthTokenMiddleware.js';
import { headerConstants } from './controllers/config.js';
import { identifySession, obfuscateServerInfo, validateCSRF } from './middleware/HardeningMiddleware.js';
// import { type AuthenticatedRequest, authenticator, router as userRouter } from './routes/UserController';

const app: express.Application = express();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const upload = multer({ dest: './files' }); // TODO: add upload use

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/files', express.static('./files'));
app.use(express.static('./static'));
app.use(cookieParser()); // to parse cookies properly
app.use(BodyParser.json()); // to support JSON-encoded bodies
app.use(BodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));
app.use(validateAuthToken); // To parse authentification tokens
app.use(identifySession); // To fingerprint the session
app.use(validateCSRF); // To validate the CSRF token for non-GET requests
app.use(obfuscateServerInfo); // To hide server-identifying headers

applyLogging(app);

app.use('/', controllerRouter());

// Redirect to sections, possibly implement a full
app.get('/', (req, res) => {
	res.redirect('/section');
});

// 404 route that accepts all remaining routes
app.get('*', function (req, res) {
	// set status
	res.status(404);

	// respond with html page
	if (req.accepts('html') !== undefined) {
		if (res.locals.user !== null && res.locals.user !== undefined) {
			res.render('pages/misc/404', { url: req.url, constants: headerConstants, userstatus_name: res.locals.user.username, userstatus_page: '/user/' + res.locals.user.id, signup_out_redirect: '/user/signout', signup_out_name: 'Sign Out' });
		} else {
			res.render('pages/misc/404', { url: req.url, constants: headerConstants, userstatus_name: 'Login', userstatus_page: '/user/login', signup_out_redirect: '/user/signup', signup_out_name: 'Sign Up' });
		}
		return;
	}

	// respond with json
	if (req.accepts('json') !== undefined) {
		res.json({ url: req.url, error: 'Page not found' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Page not found');
});

app.listen(3000, async function () {
	await sequelize.sync();
	console.log('App is listening on port 3000!');
});
