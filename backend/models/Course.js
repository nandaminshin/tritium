const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CourseSchema = new schema({
    name: {
        type: String,
        required: true
    },
    name_normalized: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    intro_video: {
        type: String
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed'],
        default: 'ongoing',
        required: true
    }
}, { timestamps: true });

CourseSchema.index({ name_normalized: 1, category: 1 }, { unique: true });

CourseSchema.statics.createCourse = async function (name, description, price, image, level, category, instructor, intro_video) {

    const normalizedName = name.replace(/\s+/g, '').toLowerCase();
    // Check for duplicate course
    let duplicateCourse = await this.findOne({ name_normalized: normalizedName, category });
    if (duplicateCourse) {
        throw new Error('A course with this name already exists in this category');
    }

    const course = await this.create({
        name,
        name_normalized: normalizedName,
        description,
        price,
        image,
        level,
        category,
        instructor,
        intro_video
    });

    return course;
};

CourseSchema.statics.getAllCourses = async function () {
    try {
        const courses = await this.find().populate('instructor').populate('category');
        return courses;
    }
    catch (error) {
        throw new Error("Course fetching first step failed");
    }
};

CourseSchema.statics.getCourseById = async function (courseId) {
    try {
        const course = await this.findById(courseId).populate('instructor').populate('category');
        return course;
    }
    catch (error) {
        throw new Error("Course fetching first step failed");
    }
};

CourseSchema.statics.updateCourse = async function (courseId, updateData) {
    if (updateData.name && updateData.category) {
        const normalizedName = updateData.name.replace(/\s+/g, '').toLowerCase();
        updateData.name_normalized = normalizedName;
        // Check for duplicate course
        let duplicateCourse = await this.findOne({ name_normalized: normalizedName, category: updateData.category, _id: { $ne: courseId } });
        if (duplicateCourse) {
            throw new Error('A course with this name already exists in this category');
        }
    }

    const course = await this.findByIdAndUpdate(courseId, updateData, { new: true });

    return course;
};

CourseSchema.statics.deleteCourse = async function (courseId) {
    await this.findByIdAndDelete(courseId);
};

module.exports = mongoose.model('Course', CourseSchema);