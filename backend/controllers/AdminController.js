const Course = require('../models/Course');
const Category = require('../models/Category');
const Lecture = require('../models/Lecture');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const AdminController = {
    getDashboardStats: async (req, res) => {
        try {
            const adminId = req.user.id;

            // Get user for account age
            const adminUser = await User.findById(adminId);

            // Get courses created by the admin
            const courses = await Course.find({ instructor: adminId });
            const courseCount = courses.length;

            // Get lectures from those courses
            const courseIds = courses.map(course => course._id);
            const lectures = await Lecture.find({ course: { $in: courseIds } });
            const lectureCount = lectures.length;

            // Mock data for now
            const totalStudents = 583; // Mock
            const averageRating = 4.8; // Mock
            const contributionHours = lectures.reduce((acc, lecture) => {
                // Add the duration of each lecture (assuming it's stored in seconds)
                return acc + (lecture.duration || 0);
            }, 0) / 3600; // Convert total seconds to hours


            return res.status(200).json({
                success: true,
                data: {
                    courseCount,
                    lectureCount,
                    totalStudents,
                    averageRating,
                    contributionHours: contributionHours.toFixed(2),
                    accountCreatedAt: adminUser.createdAt // Assuming User model has createdAt
                },
                message: 'Dashboard stats fetched successfully'
            });

        } catch (error) {
            return res.status(400).json({
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
    createNewCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const category = await Category.createCategory(name);

            return res.status(201).json({
                success: true,
                data: {
                    category
                },
                message: 'Category created successfully'
            });
        }
        catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    getAllCategories: async (req, res) => {
        try {
            let categories = await Category.getAllCategories();
            return res.status(200).json({
                success: true,
                data: {
                    categories
                },
                message: 'Get all categories successfully'
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message
            })
        }
    },

    createNewCourse: async (req, res) => {
        try {
            const { name, description, price, image, level, category, instructor, intro_video } = req.body;
            const course = await Course.createCourse(
                name,
                description,
                price,
                image,
                level,
                category,
                instructor,
                intro_video
            );

            return res.status(201).json({
                success: true,
                data: {
                    course
                },
                message: 'Course created successfully'
            });

        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    uploadCourseFile: async (req, res) => {
        try {
            const files = req.files;
            const fileUrls = {};

            if (files.image) {
                fileUrls.image = files.image[0].filename;
            }
            if (files.intro_video) {
                fileUrls.intro_video = files.intro_video[0].filename;
            }

            return res.status(200).json({
                success: true,
                data: fileUrls,
                message: 'Files uploaded successfully'
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    getAllCourses: async (req, res) => {
        try {
            const courses = await Course.getAllCourses();
            return res.status(200).json({
                success: true,
                data: {
                    courses
                },
                message: 'Get all courses successfully'
            });
        }
        catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    getCourseById: async (req, res) => {
        try {
            const { courseId } = req.params;
            const course = await Course.getCourseById(courseId);
            return res.status(200).json({
                success: true,
                data: {
                    course
                },
                message: 'Get course by id successfully'
            });
        }
        catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    deleteCourseFiles: async (req, res) => {
        try {
            const { files } = req.body;

            if (!files || !Array.isArray(files) || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No files provided for deletion'
                });
            }

            const uploadPath = path.join(__dirname, '../public/courses');
            const results = [];

            for (const filename of files) {
                const filePath = path.join(uploadPath, filename);

                try {
                    // Check if file exists before attempting to delete
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        results.push({ filename, deleted: true });
                    } else {
                        results.push({ filename, deleted: false, reason: 'File not found' });
                    }
                } catch (fileError) {
                    results.push({ filename, deleted: false, reason: fileError.message });
                }
            }

            return res.status(200).json({
                success: true,
                data: { results },
                message: 'File deletion processed'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Error deleting files'
            });
        }
    },

    updateCourse: async (req, res) => {
        const { courseId } = req.params;
        const { name, description, price, level, category, instructor } = req.body;

        let newImage, newIntroVideo;
        if (req.files) {
            newImage = req.files.image ? req.files.image[0].filename : null;
            newIntroVideo = req.files.intro_video ? req.files.intro_video[0].filename : null;
        }

        try {
            const oldCourse = await Course.findById(courseId);
            if (!oldCourse) {
                return res.status(404).json({ error: 'Course not found' });
            }

            const updatedData = {
                name,
                description,
                price,
                level,
                category,
                instructor,
                image: newImage || oldCourse.image,
                intro_video: newIntroVideo || oldCourse.intro_video,
            };

            const course = await Course.updateCourse(courseId, updatedData);

            // Clean up old files
            const filesToDelete = [];
            if (newImage && oldCourse.image) {
                filesToDelete.push(oldCourse.image);
            }
            if (newIntroVideo && oldCourse.intro_video) {
                filesToDelete.push(oldCourse.intro_video);
            }

            if (filesToDelete.length > 0) {
                const uploadPath = path.join(__dirname, '../public/courses');
                filesToDelete.forEach(filename => {
                    const filePath = path.join(uploadPath, filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    course
                },
                message: 'Course updated successfully'
            });

        } catch (error) {
            // Rollback file uploads if update fails
            const filesToRollback = [];
            if (newImage) {
                filesToRollback.push(newImage);
            }
            if (newIntroVideo) {
                filesToRollback.push(newIntroVideo);
            }

            if (filesToRollback.length > 0) {
                const uploadPath = path.join(__dirname, '../public/courses');
                filesToRollback.forEach(filename => {
                    const filePath = path.join(uploadPath, filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }

            return res.status(400).json({
                error: error.message
            });
        }
    },

    deleteCourse: async (req, res) => {
        try {
            const { courseId } = req.params;
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            const filesToDelete = [];
            if (course.image) {
                filesToDelete.push(course.image);
            }
            if (course.intro_video) {
                filesToDelete.push(course.intro_video);
            }

            if (filesToDelete.length > 0) {
                const uploadPath = path.join(__dirname, '../public/courses');
                filesToDelete.forEach(filename => {
                    const filePath = path.join(uploadPath, filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }

            await Course.deleteCourse(courseId);

            return res.status(200).json({
                success: true,
                message: 'Course deleted successfully'
            });

        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    }
};

module.exports = AdminController;