const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const Lecture = require('../models/Lecture');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const UserCourseController = {
    getCourseById: async (req, res) => {
        try {
            const course = await Course.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
                },
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
                    $addFields: {
                        category: { $arrayElemAt: ['$category', 0] },
                        instructor: { $arrayElemAt: ['$instructor', 0] }
                    }
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        level: 1,
                        price: 1,
                        image: 1,
                        introVideo: '$intro_video',
                        createdAt: 1,
                        category: 1,
                        lectures: {
                            $map: {
                                input: '$lectures',
                                as: 'lecture',
                                in: {
                                    _id: '$$lecture._id',
                                    title: '$$lecture.title',
                                    duration: '$$lecture.duration',
                                    video_url: '$$lecture.video_url',
                                    order: '$$lecture.order',
                                    hidden: '$$lecture.hidden'
                                }
                            }
                        },
                        instructor: {
                            _id: '$instructor._id',
                            name: '$instructor.name',
                            image: '$instructor.profile_image'
                        }
                    }
                }
            ]);

            if (!course || course.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            // Sort lectures by order
            course[0].lectures.sort((a, b) => a.order - b.order);

            return res.status(200).json({
                success: true,
                data: course[0]
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching course details',
                error: error.message
            });
        }
    },

    getAllCourses: async (req, res) => {
        try {
            const courses = await Course.aggregate([
                { $sort: { createdAt: -1 } },
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
                        level: 1,
                        price: 1,
                        image: 1,
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
            return res.status(200).json({
                success: true,
                data: courses
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },

    getRecentlyPublishedCourses: async (req, res) => {
        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const courses = await Course.aggregate([
                { $match: { createdAt: { $gte: oneWeekAgo } } },
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
                        level: 1,
                        price: 1,
                        image: 1,
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
            return res.status(200).json({
                success: true,
                data: courses
            });

        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to fetch recently published courses', error: error.message });
        }
    },

    getCategories: async (req, res) => {
        try {
            const categories = await Category.find({});
            return res.status(200).json({ success: true, data: categories });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
        }
    },

    getCoursesByCategory: async (req, res) => {
        try {
            const { categoryId } = req.params;
            const courses = await Course.aggregate([
                { $match: { category: new mongoose.Types.ObjectId(categoryId) } },
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
                        level: 1,
                        price: 1,
                        image: 1,
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
            return res.status(200).json({
                success: true,
                data: courses
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    },

    // Handle course enrollment
    enrollInCourse: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const courseId = req.params.id;
            const userId = req.user.id;

            // Find the course
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            // Find or create student record
            let student = await Student.findOne({ userId });
            if (!student) {
                student = new Student({ userId, coinAmount: 0, courses: [] });
            }

            // Check if student is already enrolled
            const existingEnrollment = await Enrollment.findOne({
                student: student._id,
                course: courseId
            });

            if (existingEnrollment) {
                return res.status(400).json({
                    success: false,
                    message: 'Already enrolled in this course'
                });
            }

            // Check if student has enough coins
            if (student.coinAmount < course.price) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient coin balance',
                    redirectTo: '/purchase-coin'
                });
            }

            // Create enrollment record
            const enrollment = await Enrollment.createEnrollment(student._id, courseId);

            // Deduct coins and add course to student's courses
            student.coinAmount -= course.price;
            student.courses.push(courseId);
            await student.save({ session });

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                success: true,
                message: 'Successfully enrolled in the course',
                data: {
                    coinAmount: student.coinAmount,
                    enrollment: enrollment,
                    enrolledCourse: course
                }
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success: false,
                message: 'Failed to enroll in course',
                error: error.message
            });
        }
    },

    // Get enrollment status and progress for a course
    getEnrollment: async (req, res) => {
        try {
            const { courseId } = req.params;
            const userId = req.user.id;

            const student = await Student.findOne({ userId });
            const enrollment = student ? await Enrollment.findOne({
                student: student._id,
                course: courseId
            }) : null;

            return res.status(200).json({
                success: true,
                data: {
                    isEnrolled: !!enrollment,
                    enrollment: enrollment
                }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Failed to get enrollment details',
                error: error.message
            });
        }
    },

    // Get lecture details with next and previous lecture info
    getLectureById: async (req, res) => {
        try {
            const { courseId, lectureId } = req.params;
            const userId = req.user.id;

            // Check enrollment
            const student = await Student.findOne({ userId });
            if (!student) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const enrollment = await Enrollment.findOne({
                student: student._id,
                course: courseId
            });

            if (!enrollment) {
                return res.status(403).json({
                    success: false,
                    message: 'Not enrolled in this course'
                });
            }

            // Get current lecture and adjacent lectures
            const lectures = await Lecture.find({ course: courseId })
                .sort({ order: 1 });

            const currentIndex = lectures.findIndex(l => l._id.toString() === lectureId);
            if (currentIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Lecture not found'
                });
            }

            const lecture = lectures[currentIndex];
            const previousLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
            const nextLecture = currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;

            return res.status(200).json({
                success: true,
                data: {
                    ...lecture.toObject(),
                    previousLecture,
                    nextLecture
                }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Failed to get lecture details',
                error: error.message
            });
        }
    },

    // Mark a lecture as complete
    markLectureComplete: async (req, res) => {
        try {
            const { courseId, lectureId } = req.params;
            const userId = req.user.id;

            const student = await Student.findOne({ userId });
            if (!student) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const enrollment = await Enrollment.findOne({
                student: student._id,
                course: courseId
            });

            if (!enrollment) {
                return res.status(403).json({
                    success: false,
                    message: 'Not enrolled in this course'
                });
            }

            await enrollment.updateProgress(lectureId);

            return res.status(200).json({
                success: true,
                message: 'Lecture marked as complete',
                data: enrollment
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Failed to mark lecture as complete',
                error: error.message
            });
        }
    },

    // Download lecture video
    downloadLecture: async (req, res) => {
        try {
            const { courseId, lectureId } = req.params;
            const userId = req.user.id;

            const student = await Student.findOne({ userId });
            if (!student) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const enrollment = await Enrollment.findOne({
                student: student._id,
                course: courseId
            });

            if (!enrollment) {
                return res.status(403).json({
                    success: false,
                    message: 'Not enrolled in this course'
                });
            }

            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({
                    success: false,
                    message: 'Lecture not found'
                });
            }

            const filePath = path.join(__dirname, '../public/courses/lectures', lecture.video_url);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Video file not found'
                });
            }

            res.download(filePath);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Failed to download lecture',
                error: error.message
            });
        }
    }
};

module.exports = UserCourseController;
