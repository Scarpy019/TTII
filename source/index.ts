
import bodyParser = require('body-parser');
import express = require('express');// Create a new express app instance
import { sequelize } from './sequelizeSetup';
import { router as userRouter } from './routes/UserController'
const app: express.Application = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(3000, async function () {
    await sequelize.sync()
    console.log('App is listening on port 3000!');
});

app.use('/user', userRouter);
