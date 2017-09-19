const User = require('mongoose').model('User');
const moment = require('moment');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, username, password, done) => {
    const userData = {
        username: username.trim(),
        password: password.trim(),
        createdAt: moment().format()
    };

    const newUser = new User(userData);
    newUser.save((err) => {
        if (err) {
            console.log(err);
            return done(err);
        }

        return done(null);
    });
});