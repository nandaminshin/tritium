const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { body } = require("express-validator");
const HandleErrorMessage = require('../middlewares/HandleErrorMessage');
const User = require('../models/User');
const { requireAuth } = require('../middlewares/AuthMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage for receipts
const receiptStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../public/users/receipts');
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const uploadReceipt = multer({
    storage: receiptStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'), false);
        }
    }
});

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
router.get('/verify-token', UserController.verifyToken);
router.get('/categories', UserController.getCategories);

router.get('/get-payment-info', UserController.getPaymentInfo);
router.get('/get-pending-purchase', requireAuth, UserController.getPendingPurchase);

router.post('/create-purchase', requireAuth, uploadReceipt.single('receiptImage'), UserController.createPurchase);

module.exports = router;

