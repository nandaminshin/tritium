const Course = require('../models/Course');
const Category = require('../models/Category');
const Lecture = require('../models/Lecture');
const fs = require('fs');
const path = require('path');

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
};

module.exports = AdminController;