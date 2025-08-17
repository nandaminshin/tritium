const PaymentInfo = require('../models/PaymentInfo');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const PurchaseCoin = require('../models/PurchaseCoin');
const Student = require('../models/Student');

const SuperAdminController = {
    createPaymentInfo: async (req, res) => {
        const { coinPrice, kPay, wavePay, ayaPay, uabPay, additionalPay } = req.body;
        try {
            const existingPaymentInfo = await PaymentInfo.findOne({});
            if (existingPaymentInfo) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment information already exists'
                });
            }
            const paymentInfo = new PaymentInfo({
                coinPrice,
                kPay,
                wavePay,
                ayaPay,
                uabPay,
                additionalPay
            });
            await paymentInfo.save();
            res.status(201).json({
                success: true,
                data: paymentInfo,
                message: 'Payment information created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create payment information',
                error: error.message
            });
        }
    },

    getSuperAdminDashboard: async (req, res) => {
        try {
            res.status(200).json({
                success: true,
                message: 'Welcome to the Super Admin Dashboard'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to load Super Admin Dashboard',
                error: error.message
            });
        }
    },

    getPaymentInfo: async (req, res) => {
        try {
            const paymentInfo = await PaymentInfo.getPaymentInfo();
            res.status(200).json({
                success: true,
                data: paymentInfo
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve payment information',
                error: error.message
            });
        }
    },

    updateProfile: async (req, res) => {
        const { id } = req.user;
        const { name, email } = req.body;
        const newProfileImage = req.file;

        try {
            const user = await User.findById(id);
            if (!user) {
                if (newProfileImage) {
                    const newImagePath = path.join(__dirname, '../public/users', newProfileImage.filename);
                    if (fs.existsSync(newImagePath)) {
                        fs.unlinkSync(newImagePath);
                    }
                }
                return res.status(404).json({ error: 'User not found' });
            }

            const oldProfileImage = user.profile_image;
            const updatedData = {
                name,
                email,
                profile_image: newProfileImage ? newProfileImage.filename : oldProfileImage,
            };

            const updatedUser = await User.updateUser(id, updatedData);

            if (newProfileImage && oldProfileImage) {
                const oldImagePath = path.join(__dirname, '../public/users', oldProfileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            return res.status(200).json({
                success: true,
                data: {
                    user: updatedUser
                },
                message: 'Profile updated successfully'
            });

        } catch (error) {
            if (newProfileImage) {
                const newImagePath = path.join(__dirname, '../public/users', newProfileImage.filename);
                if (fs.existsSync(newImagePath)) {
                    fs.unlinkSync(newImagePath);
                }
            }
            return res.status(400).json({
                error: error.message
            });
        }
    },

    deleteProfile: async (req, res) => {
        const { id } = req.user;

        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (user.profile_image) {
                const oldImagePath = path.join(__dirname, '../public/users', user.profile_image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            await User.deleteUser(id);

            res.clearCookie('token');

            return res.status(200).json({
                success: true,
                message: 'Account deleted successfully'
            });

        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    updatePaymentInfo: async (req, res) => {
        const { coinPrice, kPay, wavePay, ayaPay, uabPay, additionalPay } = req.body;

        try {
            const updatedPaymentInfo = await PaymentInfo.updatePaymentInfo({
                coinPrice,
                kPay,
                wavePay,
                ayaPay,
                uabPay,
                additionalPay
            });

            // Emit the event to all connected clients
            const { io } = req;
            io.emit('priceUpdated');

            res.status(200).json({
                success: true,
                data: updatedPaymentInfo,
                message: 'Payment information updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update payment information',
                error: error.message
            });
        }
    },

    getPurchaseRequests: async (req, res) => {
        try {
            const purchaseRequests = await PurchaseCoin.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
            res.status(200).json({
                success: true,
                data: purchaseRequests
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve purchase requests',
                error: error.message
            });
        }
    },

    approvePurchase: async (req, res) => {
        const { purchaseId } = req.params;
        try {
            const purchase = await PurchaseCoin.findById(purchaseId);
            if (!purchase) {
                return res.status(404).json({
                    success: false,
                    message: 'Purchase request not found'
                });
            }

            purchase.approveStatus = true;
            await purchase.save();

            let student = await Student.findOne({ userId: purchase.userId });
            if (student) {
                student.coinAmount += purchase.coinAmount;
                await student.save();
            } else {
                student = new Student({
                    userId: purchase.userId,
                    coinAmount: purchase.coinAmount
                });
                await student.save();
            }

            res.status(200).json({
                success: true,
                message: 'Purchase approved successfully',
                data: purchase
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to approve purchase',
                error: error.message
            });
        }
    },

    deletePurchaseRequest: async (req, res) => {
        const { purchaseId } = req.params;
        try {
            const purchase = await PurchaseCoin.findById(purchaseId);
            if (!purchase) {
                return res.status(404).json({
                    success: false,
                    message: 'Purchase request not found'
                });
            }

            // Delete the receipt image from the filesystem
            if (purchase.receiptImage) {
                const imagePath = path.join(__dirname, '../public/users/receipts', purchase.receiptImage);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await PurchaseCoin.findByIdAndDelete(purchaseId);

            res.status(200).json({
                success: true,
                message: 'Purchase request deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete purchase request',
                error: error.message
            });
        }
    },

    getAllAdmins: async (req, res) => {
        try {
            const admins = await User.getAllAdmins();
            return res.status(200).json({
                success: true,
                data: admins,
                message: 'Admins retrieved successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve admins',
                error: error.message
            });
        }
    }
};

module.exports = SuperAdminController;

