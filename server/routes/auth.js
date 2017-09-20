const express = require('express');
const validator = require('validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const router = new express.Router();
require('dotenv').config();

router.post('/signup', (req, res, next) => {

    // invoking signup middleware

    return passport.authenticate('local-signup', (err) => {

        // throwing any errors

        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Check the form for errors',
                    errors: {
                        username: 'This username is already taken.'
                    }
                });
            }
        
            return res.status(400).json({
                success: false,
                message: err
            });
        }

        // if no errors then confirm signup

        return res.status(200).json({
            success: true,
            message: 'You have successfully signed up! Now you should be able to log in.'
        });

    })(req,res,next);
});

router.post('/login', (req, res, next) => {

    // invoking login middleware

    return passport.authenticate('local-login', (err, token, userData) => {
        
        // throwing any errors

        if (err) {
            if (err.name === 'IncorrectCredentialsError') {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            
            return res.status(400).json({
                success: false,
                message: 'Could not process the form.'
            });
        }

        // if no errors then confirm login and return authorization token

        return res.json({
            success: true,
            message: 'You have successfully logged in!',
            user: userData,
            token
        });
    })(req, res, next);
});

// logout function duh

router.get('/logout', (req, res) => {
    req.logout();
});

module.exports = router;