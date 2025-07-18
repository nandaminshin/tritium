const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const createJWT = require('../Helpers/createJWT');
const { getPaymentInfo } = require('./SuperAdminController');
const PaymentInfo = require('../models/PaymentInfo');
const PurchaseCoin = require('../models/PurchaseCoin');

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
    },

    getFeaturedCourses: async (req, res) => {
        try {
            const courses = await Course.aggregate([
                { $sort: { createdAt: -1 } },
                { $limit: 8 },
                {
                    $lookup: {
                        from: 'lectures',
                        localField: '_id',
                        foreignField: 'course',
                        as: 'lectures'
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'instructor',
                        foreignField: '_id',
                        as: 'instructor'
                    }
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        level: 1,
                        price: 1,
                        image: '$image',
                        introVideo: '$intro_video',
                        createdAt: 1,
                        lectureCount: { $size: '$lectures' },
                        category: { $arrayElemAt: ['$category', 0] },
                        instructor: { $arrayElemAt: ['$instructor', 0] }
                    }
                },
                {
                    $project: {
                        'instructor.password': 0,
                        'instructor.email': 0,
                        'instructor.role': 0,
                        'instructor.coin': 0,
                        'instructor.courses': 0,
                        'instructor.createdAt': 0,
                        'instructor.updatedAt': 0
                    }
                }
            ]);
            return res.status(200).json(courses);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },

    getCategories: async (req, res) => {
        try {
            const categories = await Category.getAllCategories();
            return res.status(200).json(categories);
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },

    getPaymentInfo: async (req, res) => {
        try {
            const paymentInfo = await PaymentInfo.getPaymentInfo();
            return res.status(200).json({
                success: true,
                data: paymentInfo
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    getPendingPurchase: async (req, res) => {
        try {
            const userId = req.user.id;
            const pendingPurchase = await PurchaseCoin.findOne({ userId, approveStatus: false });
            return res.status(200).json({
                success: true,
                data: pendingPurchase
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    createPurchase: async (req, res) => {
        try {
            const { paymentMethod, coinAmount, totalCost } = req.body;
            const receiptImage = req.file.filename;
            const userId = req.user.id;

            const purchase = new PurchaseCoin({
                userId,
                paymentMethod,
                coinAmount,
                totalCost,
                receiptImage,
            });

            await purchase.save();

            return res.status(201).json({
                success: true,
                message: 'Purchase request created successfully',
                data: purchase,
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
}

module.exports = UserController;