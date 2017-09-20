const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); 
const passport = require('passport');
const app = express();
require('dotenv').config();

// allow encoding of url and requests to be sent through json

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// loading all object schemas and connecting to database instance

const models = require('./models');
models.connect(process.env.DB_URI, {useMongoClient: true});

// initializing route protection

app.use(passport.initialize());

// loading signup/login protocol middlewares

const signupStrategy = require('./auth/signup');
const loginStrategy = require('./auth/login');

passport.use('local-signup', signupStrategy);
passport.use('local-login', loginStrategy);

// defining routes

const authMiddleware = require('./auth/middleware');
const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards');
const listRoutes = require('./routes/lists');

app.use('/', authRoutes);
app.use('/list', listRoutes);
app.use('/card', cardRoutes);

// sending static form html file

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

// listening for requests

app.listen(process.env.PORT, err => {
    if (err) {
      console.error(err);
    } else {
      console.info("🌎 Peep port %s. 🌎", process.env.PORT);
    }
});