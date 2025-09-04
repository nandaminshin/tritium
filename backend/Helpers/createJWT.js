const jwt = require('jsonwebtoken');

let maxAge = 3 * 24 * 60 * 60 * 1000;;

module.exports = function (user) {
    const payload = {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image
    };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: maxAge });
}