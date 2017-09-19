const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
require('dotenv').config();

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).end();
    }

    const token = req.headers.authorization;

    return jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json(err);
        }

        const userId = decoded.sub;

        return User.findById(userId, (userErr, user) => {
            if (userErr || !user || !user.verified) {
                return res.status(401).json(err).end();
            }

            return next();
        });
    });
};