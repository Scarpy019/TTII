
import BodyParser from 'body-parser';
import express from 'express';// Create a new express app instance
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { sequelize } from './sequelizeSetup.js';
import { controllerRouter } from './controllers/index.js';
import { validateAuthToken } from './middleware/AuthTokenMiddleware.js';
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
		res.render('pages/misc/404', { url: req.url });
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
