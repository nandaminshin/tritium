const jwt = require('jsonwebtoken');

let maxAge = 3 * 24 * 60 * 60;

module.exports = function (_id) {
    return jwt.sign({ _id }, 'mysecret', { expiresIn: maxAge });
}