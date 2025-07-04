const express = require('express');
const router = express.Router();
const { body, check, validationResult } = require("express-validator");
const HandleErrorMessage = require('../middlewares/HandleErrorMessage');
const AdminController = require('../controllers/AdminController');
const { upload } = require('../Helpers/UploadFile');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const LectureController = require('../controllers/LectureController');
const multer = require('multer');
const path = require('path');

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
]),
    body('image').custom((value, { req }) => {
        if (!req.files || !req.files.image) {
            throw new Error('Image file is required');
        }
        if (!req.files.image[0].mimetype.startsWith('image/')) {
            throw new Error('Invalid image file type');
        }
        if (!req.files.intro_video) {
            throw new Error('Video file is required');
        }
        if (!req.files.intro_video[0].mimetype.startsWith('video/')) {
            throw new Error('Invalid video file type');
        }
        return true;
    }),
    AdminController.uploadCourseFile);

router.get('/get-all-courses', AuthMiddleware, AdminController.getAllCourses);
router.get('/get-course-by-id/:courseId', AuthMiddleware, AdminController.getCourseById);

// Add this new route for file deletion
router.post('/delete-course-files', AuthMiddleware, AdminController.deleteCourseFiles);


// Set up multer for video uploads
const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/courses/lectures'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const LectureVideoUpload = multer({ storage: videoStorage });

// Lecture routes
router.get('/courses/:courseId/lectures', AuthMiddleware, LectureController.getLecturesByCourse);

router.post('/courses/:courseId/lectures', AuthMiddleware, HandleErrorMessage, LectureController.addLecture);

router.post('/courses/:courseId/lectures/upload-video', AuthMiddleware, HandleErrorMessage, LectureVideoUpload.single('video_url'), LectureController.uploadVideo);

router.put('/lectures/reorder', AuthMiddleware, LectureController.reorderLectures);

// router.put('/lectures/:lectureId', AuthMiddleware, LectureVideoUpload.single('video'), LectureController.updateLecture);

router.delete('/lectures/:lectureId', AuthMiddleware, LectureController.deleteLecture);

router.put('/lectures/:lectureId/hidden', AuthMiddleware, LectureController.toggleLectureHidden);

router.get('/courses/:courseId/lectures/:lectureId', AuthMiddleware, LectureController.getLectureById);

router.put('/courses/:courseId/lectures/:lectureId', AuthMiddleware, LectureController.updateLectureById);

module.exports = router;
