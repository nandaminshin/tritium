const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static');

ffmpeg.setFfprobePath(ffprobeStatic.path);

const LectureController = {
    // List all lectures for a course, ordered by 'order'
    getLecturesByCourse: async (req, res) => {
        try {
            const { courseId } = req.params;
            const lectures = await Lecture.getLecuresBycourse(courseId);
            return res.status(200).json({
                success: true,
                data: { lectures },
                message: 'Lectures fetched successfully'
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    // Add a new lecture (with video upload)
    addLecture: async (req, res) => {
        try {
            const { title, order, video_url, duration } = req.body;
            const { courseId } = req.params;
            const lecture = await Lecture.addLecture(title, order, video_url, courseId, duration);
            return res.status(201).json({
                success: true,
                data: { lecture },
                message: 'Lecture added successfully'
            });
        } catch (error) {
            if (req.body.video_url) {
                const filePath = path.join(__dirname, '../public/courses/lectures', req.body.video_url);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            return res.status(400).json({ error: error.message });
        }
    },

    uploadVideo: async (req, res) => {
        const { courseId } = req.params;
        const { old_video_url } = req.body;
        const newVideoPath = req.file.path;

        try {
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                return res.status(400).json({ msg: 'Not a valid course id' });
            }

            // Delete old video if it exists
            if (old_video_url) {
                const oldPath = path.join(__dirname, '../public/courses/lectures', old_video_url);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // Get video duration
            ffmpeg.ffprobe(newVideoPath, (err, metadata) => {
                if (err) {
                    // If ffprobe fails, delete the uploaded file and return an error
                    fs.unlinkSync(newVideoPath);
                    return res.status(500).json({ error: 'Could not get video duration.' });
                }
                const duration = metadata.format.duration;
                return res.status(200).json({
                    video_url: req.file.filename,
                    duration: Math.round(duration) // Return duration in seconds
                });
            });

        } catch (error) {
            // If any other error occurs, delete the uploaded file
            fs.unlinkSync(newVideoPath);
            return res.status(400).json({ error: error.message });
        }
    },

    // Update lecture (title, order, video)
    // updateLecture: async (req, res) => {
    //     try {
    //         const { lectureId } = req.params;
    //         const { title, order } = req.body;
    //         let updateData = { title, order };
    //         if (req.file) {
    //             // Remove old video file
    //             const lecture = await Lecture.findById(lectureId);
    //             if (lecture && lecture.video_url) {
    //                 const oldPath = path.join(__dirname, '../public/courses', lecture.video_url);
    //                 if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    //             }
    //             updateData.video_url = req.file.filename;
    //         }
    //         const updatedLecture = await Lecture.findByIdAndUpdate(lectureId, updateData, { new: true });
    //         return res.status(200).json({
    //             success: true,
    //             data: { lecture: updatedLecture },
    //             message: 'Lecture updated successfully'
    //         });
    //     } catch (error) {
    //         return res.status(400).json({ error: error.message });
    //     }
    // },

    // Delete lecture
    deleteLecture: async (req, res) => {
        try {
            const { lectureId } = req.params;
            const lecture = await Lecture.findByIdAndDelete(lectureId);
            if (lecture && lecture.video_url) {
                const filePath = path.join(__dirname, '../public/courses/lectures', lecture.video_url);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            return res.status(200).json({
                success: true,
                message: 'Lecture deleted successfully'
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    // Reorder lectures (bulk update)
    reorderLectures: async (req, res) => {
        try {
            const { lectures } = req.body; // [{_id, order}, ...]
            for (const lec of lectures) {
                await Lecture.findByIdAndUpdate(lec._id, { order: lec.order });
            }
            return res.status(200).json({
                success: true,
                message: 'Lectures reordered successfully'
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    // Toggle hidden field (hide/unhide lecture)
    toggleLectureHidden: async (req, res) => {
        try {
            const { lectureId } = req.params;
            const { hidden } = req.body;
            const updatedLecture = await Lecture.findByIdAndUpdate(lectureId, { hidden }, { new: true });
            return res.status(200).json({
                success: true,
                data: { lecture: updatedLecture },
                message: `Lecture ${hidden ? 'hidden' : 'unhidden'} successfully`
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    getLectureById: async (req, res) => {
        try {
            const { lectureId } = req.params;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({
                    success: false,
                    error: 'Lecture not found'
                });
            }
            return res.status(200).json(lecture);
        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

    updateLectureById: async (req, res) => {
        try {
            const { lectureId } = req.params;
            // Include duration in the destructured body
            const { title, hidden, course, video_url, duration } = req.body;
            const data = { title, hidden, course };
            if (video_url) {
                data.video_url = video_url;
            }
            // Add duration to the data object if it exists
            if (duration) {
                data.duration = duration;
            }
            const lecture = await Lecture.updateLectureById(lectureId, data);
            return res.status(200).json({
                success: true,
                data: { lecture },
                message: 'Lecture updated successfully'
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    },

};

module.exports = LectureController;

module.exports = LectureController; 