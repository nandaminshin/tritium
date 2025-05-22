const jwt = require('jsonwebtoken');

const AuthMiddleware = (req, res, next) => {
    let token = req.cookies.jwt ? req.cookies.jwt : null;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedValue) => {
            if (err) {
                return res.status(401).json({
                    "message": "Unauthenticated user"
                });
            }
            else {
                next();
            }
        });
    } else {
        return res.status(400).json({ message: "Token must be provided" });
    }
}

module.exports = AuthMiddleware;