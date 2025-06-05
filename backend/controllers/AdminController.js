const Course = require('../models/Course');
const Category = require('../models/Category');

const AdminController = {
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
};

module.exports = AdminController;