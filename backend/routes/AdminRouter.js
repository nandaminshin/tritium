const express = require('express');
const router = express.Router();
const { body, check } = require("express-validator");
const HandleErrorMessage = require('../middlewares/HandleErrorMessage');
const AdminController = require('../controllers/AdminController');
const { upload } = require('../Helpers/UploadFile');

router.post('/create-new-category', [
    body('name').notEmpty().withMessage('Category name is required'),
    HandleErrorMessage
], AdminController.createNewCategory);

router.get('/get-all-categories', AdminController.getAllCategories);

router.post('/create-new-course', [
    body('name').notEmpty().withMessage('Course name is required'),
    body('description').notEmpty().withMessage('Course description is required'),
    body('price').notEmpty().isNumeric().withMessage('Price must be a number'),
    body('instructor').notEmpty().withMessage('Instructor is required'),
    body('level').notEmpty().withMessage('Course level is required'),
    body('category').notEmpty().withMessage('Course category is required'),
    HandleErrorMessage
], AdminController.createNewCourse);

// New file upload endpoint - accepts both image and video files
router.post('/upload-course-file', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'intro_video', maxCount: 1 }
]), AdminController.uploadCourseFile);

router.get('/get-all-courses', AdminController.getAllCourses);
router.get('/get-course-by-id/:courseId', AdminController.getCourseById);

module.exports = router;
