const User = require('../models/User');
const createJWT = require('../Helpers/createJWT');

const UserController = {
    login: async (req, res) => {
        try {
            let { email, password } = req.body;
            let user = await User.login(email, password);
            let token = createJWT(user);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
            return res.json({ user, token });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },

    register: async (req, res) => {
        try {
            let { name, email, password } = req.body;
            let user = await User.register(name, email, password);
            let token = createJWT(user);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
            return res.json({ user, token });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },

    logout: (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 });
        return res.json({ message: "user logged out" });
    },

    verifyToken: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    error: 'No token provided'
                });
            }

            const user = await User.verifyToken(token);
            return res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            return res.status(401).json({
                error: error.message
            });
        }
    }
}

module.exports = UserController;