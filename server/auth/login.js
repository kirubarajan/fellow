const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

module.exports = new PassportLocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, username, password, done) => {

    // creating object of data passed into middleware

    const userData = {
        username: username.trim(),
        password: password.trim()
    };

    // checking if user exists

    return User.findOne({ username: userData.username }, (err, user) => {
        if (err) {
            return done(err);
        }

        // throwing any errors if raised

        if (!user) {
            const error = new Error('Incorrect username or password.');
            error.name = 'IncorrectCredentialsError';

            return done(error);
        }

        // hashing provided password and comparing to original password hash

        return user.comparePassword(userData.password, (passwordErr, match) => {
            if (err) {
                return done(err);
            }

            // throwing error if not match

            if (!match) {
                const error = new Error('Incorrect username or password.');
                error.name = 'IncorrectCredentialsError';

                return done(error);
            }

            // creates and signs token to be sent back to user

            const payload = {
                username,
                sub: user._id,
            };

            const token = jwt.sign(payload, process.env.SECRET, { /* (UNCOMMENT FOR TOKEN EXPIRATION) expiresIn: 60 * 120*/ });
            const data = {
                username,
                name: user.name,
                _id: user._id,
            };

            return done(null, token, data);
        });
    });
});