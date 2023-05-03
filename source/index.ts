
import bodyParser = require('body-parser');
import express = require('express');// Create a new express app instance
import cookieParser = require('cookie-parser');
import multer = require('multer');
import { sequelize } from './sequelizeSetup';
import { AuthenticatedRequest, authenticator, router as userRouter } from './routes/UserController';


const app: express.Application = express();

var upload = multer({dest:'./files'});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static('./files'));
app.use(cookieParser()); // to parse cookies properly
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

app.get('/', authenticator, function (req: AuthenticatedRequest, res) {
    if(req.user){
        res.send("Hello "+ req.user.username + "!");
    }else{
        res.send('Hello World!');
    }
});



app.use('/user', userRouter);


// 404 route that accepts all remaining routes
app.get('*', function(req, res){
    //set status
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('pages/misc/404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.json({url:req.url, error: 'Page not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Page not found');
});


app.listen(3000, async function () {
    await sequelize.sync()
    console.log('App is listening on port 3000!');
});