const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CourseSchema = new schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    intro_video: {
        type: String
    }
});

CourseSchema.statics.createCourse = async function (name, description, price, image, level, category, instructor, intro_video) {
    try {
        // Check for duplicate course
        let duplicateCourse = await this.findOne({ name });
        if (duplicateCourse) {
            throw new Error('A course with this name already exists');
        }

        const course = await this.create({
            name,
            description,
            price,
            image,
            level,
            category,
            instructor,
            intro_video
        });

        return course;
    } catch (error) {
        throw new Error("Creation first step failed");
    }
};

CourseSchema.statics.getAllCourses = async function () {
    try {
        const courses = await this.find().populate('instructor');
        return courses;
    }
    catch (error) {
        throw new Error("Course fetching first step failed");
    }
};

CourseSchema.statics.getCourseById = async function (courseId) {
    try {
        const course = await this.findById(courseId).populate('instructor');
        return course;
    }
    catch (error) {
        throw new Error("Course fetching first step failed");
    }
};

module.exports = mongoose.model('Course', CourseSchema);