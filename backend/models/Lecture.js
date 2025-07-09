const mongoose = require('mongoose');
const schema = mongoose.Schema;

const LectureSchema = new schema({
    title: {
        type: String,
        required: true
    },
    title_normalized: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    video_url: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

LectureSchema.index({ title_normalized: 1, course: 1 }, { unique: true });

LectureSchema.statics.getLecuresBycourse = async function (courseId) {
    try {
        const lectures = await this.find({ course: courseId }).sort({ order: 1 });
        return lectures;
    }
    catch (error) {
        throw new Error("Lectures fetching first step failed");
    }
}

LectureSchema.statics.addLecture = async function (title, order, video_url, courseId, duration) {
    const normalizedTitle = title.replace(/\s+/g, '').toLowerCase();

    let titleAlreadyExists = await this.findOne({
        title_normalized: normalizedTitle,
        course: courseId
    });
    if (titleAlreadyExists) {
        throw new Error('Title already exists');
    }

    let orderAlreadyExists = await this.findOne({
        order: order,
        course: courseId
    });
    if (orderAlreadyExists) {
        throw new Error('Lecture with this order already exists');
    }

    const lecture = await this.create({
        title,
        title_normalized: normalizedTitle,
        video_url,
        duration,
        order,
        course: courseId
    });
    return lecture;
}

LectureSchema.statics.updateLectureById = async function (lectureId, data) {
    const updateData = { ...data };

    if (data.title && data.course) {
        const normalizedTitle = data.title.replace(/\s+/g, '').toLowerCase();
        let alreadyExists = await this.findOne({
            title_normalized: normalizedTitle,
            course: data.course,
            _id: { $ne: lectureId }
        });

        if (alreadyExists) {
            throw new Error('A lecture with this title already exists in this course');
        }
        updateData.title_normalized = normalizedTitle;
    }

    const lecture = await this.findByIdAndUpdate(
        lectureId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!lecture) {
        throw new Error('Lecture not found');
    }
    return lecture;
}


module.exports = mongoose.model('Lecture', LectureSchema);