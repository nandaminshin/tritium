const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { body } = require("express-validator");
const HandleErrorMessage = require('../middlewares/HandleErrorMessage');
const User = require('../models/User')

router.post('/login', UserController.login);
router.post('/register', [
    body('name').notEmpty(),
    body('email').notEmpty(),
    body('email').custom(async value => {
        const user = await User.findOne({ email: value });
        if (user) {
            throw new Error('E-mail already in use');
        }
    }),
    body('password').notEmpty(),
    HandleErrorMessage
], UserController.register);
router.post('/logout', UserController.logout);

module.exports = router;