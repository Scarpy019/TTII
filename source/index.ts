import BodyParser from 'body-parser';
import express from 'express'; // Create a new express app instance
import cookieParser from 'cookie-parser';
import { controllerRouter } from './controllers/index.js';
import { logUserAction } from './middleware/LoggingMiddleware.js';
import { validateAuthToken } from './middleware/AuthTokenMiddleware.js';
import { headerConstants } from './controllers/config.js';
import { localization } from './middleware/LocalizationMiddleware.js';
import { identifySession, obfuscateServerInfo, validateCSRF } from './middleware/HardeningMiddleware.js';
import { logger } from './lib/Logger.js';
import cors from 'cors';
import { server as config } from './config.js';
import { readFileSync } from 'fs';
import { createServer } from 'https';
import { sequelize } from './sequelizeSetup.js';
import * as http from 'http';
import { io } from './sockets/Socket.js';
import { originURLMiddleware } from './middleware/OriginMiddleware.js';
// import { type AuthenticatedRequest, authenticator, router as userRouter } from './routes/UserController';

const app: express.Application = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.static('./static'));
app.use('/files', express.static('./files'));
app.use(cookieParser()); // to parse cookies properly
app.use(BodyParser.json()); // to support JSON-encoded bodies
app.use(BodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));
app.use(originURLMiddleware);
app.use(validateAuthToken); // To parse authentification tokens
app.use(logUserAction); // To log actions on endpoints
app.use(identifySession); // To fingerprint the session
app.use(validateCSRF); // To validate the CSRF token for non-GET requests
app.use(obfuscateServerInfo); // To hide server-identifying headers

app.use('/', localization, controllerRouter());

// Redirect to sections, possibly implement a full
app.get('/', (_req, res) => {
	res.redirect('/section');
});

app.get('/reklama', (_, res) => {
	res.redirect('http://reklama.narvesen.lv');
});
app.get('/narvesen', (_, res) => {
	res.redirect('http://reklama.narvesen.lv');
});

// 404 route that accepts all remaining routes
app.get('*', function (req, res) {
	// set status
	res.status(404);

	// respond with html page
	if (req.accepts('html') !== undefined) {
		res.render('pages/misc/404', {
			url: req.url,
			constants: headerConstants,
			originURL: null // For redirect purposes with login button
		});
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

const server = http.createServer(app);
io.listen(server); // Make the Socket.IO server listen to the HTTP server

const options = {
	key: readFileSync(config.keyLocation),
	cert: readFileSync(config.certLocation)
};

const HTTPport = config.debug ? 3000 : 80;
server.listen(HTTPport, async function () {
	await sequelize.sync();
	logger.info(`App is listening for HTTP on ${HTTPport}`);

	const HTTPSport = config.debug ? 3001 : 443;
	const HTTPSserver = createServer(options, app);
	io.listen(HTTPSserver); // Make the Socket.IO server listen to the HTTPS server
	HTTPSserver.listen(HTTPSport, async function () {
		logger.info(`App is listening for HTTPS on ${HTTPSport}`);
	});
});
