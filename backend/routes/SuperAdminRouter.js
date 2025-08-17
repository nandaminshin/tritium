const express = require('express');
const router = express.Router();
const { body, check, validationResult } = require("express-validator");
const HandleErrorMessage = require('../middlewares/HandleErrorMessage');
const SuperAdminController = require('../controllers/SuperAdminController');
const { requireAuth, requireRole } = require('../middlewares/AuthMiddleware');
const multer = require('multer');
const path = require('path');

router.use(requireAuth, requireRole('superAdmin'));

const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/users'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const userProfileUpload = multer({ storage: userStorage });

router.get('/', SuperAdminController.getSuperAdminDashboard);

router.get('/get-payment-info', SuperAdminController.getPaymentInfo);
router.post('/create-payment-info', [
    body('coinPrice').notEmpty().isNumeric().withMessage('Coin price is required and must be a number'),
    body('kPay').notEmpty().isString().withMessage('kPay is required and must be a string'),
    body('wavePay').notEmpty().isString().withMessage('wavePay is required and must be a string'),
    body('ayaPay').notEmpty().isString().withMessage('ayaPay is required and must be a string'),
    body('uabPay').notEmpty().isString().withMessage('uabPay is required and must be a string'),
    body('additionalPay').optional().isString().withMessage('additionalPay must be a string'),
    HandleErrorMessage], SuperAdminController.createPaymentInfo);

router.put('/update-profile', userProfileUpload.single('profile_image'), [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    HandleErrorMessage
], SuperAdminController.updateProfile);

router.delete('/delete-profile', SuperAdminController.deleteProfile);

router.put('/update-payment-info', [
    body('coinPrice').optional().isNumeric().withMessage('Coin price must be a number'),
    body('kPay').optional().isString().withMessage('kPay must be a string'),
    body('wavePay').optional().isString().withMessage('wavePay must be a string'),
    body('ayaPay').optional().isString().withMessage('ayaPay must be a string'),
    body('uabPay').optional().isString().withMessage('uabPay must be a string'),
    body('additionalPay').optional().isString().withMessage('additionalPay must be a string'),
    HandleErrorMessage
], SuperAdminController.updatePaymentInfo);

router.get('/purchase-requests', SuperAdminController.getPurchaseRequests);
router.put('/approve-purchase/:purchaseId', SuperAdminController.approvePurchase);
router.delete('/purchase-requests/:purchaseId', SuperAdminController.deletePurchaseRequest);
router.get('/get-all-admins', SuperAdminController.getAllAdmins);

module.exports = router;

