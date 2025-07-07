const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized' });
            } else {
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    };
};

module.exports = { requireAuth, requireRole };