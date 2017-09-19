const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); 
const passport = require('passport');
const app = express();
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const models = require('./models');
models.connect(process.env.DB_URI, {useMongoClient: true});

app.use(passport.initialize());

const signupStrategy = require('./auth/signup');
const loginStrategy = require('./auth/login');

passport.use('local-signup', signupStrategy);
passport.use('local-login', loginStrategy);

const authMiddleware = require('./auth/middleware');
const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards');
const listRoutes = require('./routes/lists');

app.use('/', authRoutes);
app.use('/list', listRoutes);
app.use('/card', cardRoutes);

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.listen(process.env.PORT, err => {
    if (err) {
      console.error(err);
    } else {
      console.info("🌎 Peep port %s. 🌎", process.env.PORT);
    }
});