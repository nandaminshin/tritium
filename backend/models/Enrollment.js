const mongoose = require('mongoose');

// Import Course model to access its schema
const Course = mongoose.model('Course');

const EnrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        completedLectures: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecture'
        }],
        status: {
            type: String,
            enum: ['ongoing', 'finished'],
            default: 'ongoing',
        },
        lastAccessedAt: {
            type: Date,
            default: Date.now,
        },
        completionPercentage: {
            type: Number,
            default: 0,
        }
    },
    { timestamps: true }
);

// Indexes for faster queries
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
EnrollmentSchema.index({ status: 1 });

// Static methods
EnrollmentSchema.statics.createEnrollment = async function (studentId, courseId) {
    const enrollment = new this({
        student: studentId,
        course: courseId,
    });
    return await enrollment.save();
};

// Method to update progress
EnrollmentSchema.methods.updateProgress = async function (completedLectureId) {
    try {
        // Ensure completedLectures is initialized as an array
        if (!this.completedLectures) {
            this.completedLectures = [];
        }

        // Convert completedLectureId to string for comparison
        const lectureIdStr = completedLectureId.toString();

        // Only add if not already completed
        if (!this.completedLectures.some(id => id.toString() === lectureIdStr)) {
            this.completedLectures.push(completedLectureId);

            // Get total lecture count for the course using aggregation
            const course = await Course.aggregate([
                { $match: { _id: this.course } },
                {
                    $lookup: {
                        from: 'lectures',
                        localField: '_id',
                        foreignField: 'course',
                        as: 'lectures'
                    }
                },
                {
                    $project: {
                        totalLectures: {
                            $size: {
                                $filter: {
                                    input: '$lectures',
                                    as: 'lecture',
                                    cond: { $eq: ['$$lecture.hidden', false] }
                                }
                            }
                        }
                    }
                }
            ]).exec();

            if (course && course[0]) {
                const totalLectures = course[0].totalLectures;
                // Calculate completion percentage
                this.completionPercentage = Math.round((this.completedLectures.length / totalLectures) * 100);

                // Update status if course is completed
                if (this.completionPercentage === 100) {
                    this.status = 'finished';
                }
            }

            this.lastAccessedAt = new Date();
            await this.save();
        }
        return this;
    } catch (error) {
        console.error('Error updating progress:', error);
        throw error;
    }
};

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
