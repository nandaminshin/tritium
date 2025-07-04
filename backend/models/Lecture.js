const mongoose = require('mongoose');
const schema = mongoose.Schema;

const LectureSchema = new schema({
    title: {
        type: String,
        required: true
    },
    video_url: {
        type: String,
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
});

LectureSchema.statics.getLecuresBycourse = async function (courseId) {
    try {
        const lectures = await this.find({ course: courseId }).sort({ order: 1 });
        return lectures;
    }
    catch (error) {
        throw new Error("Lectures fetching first step failed");
    }
}

LectureSchema.statics.updateLectureById = async function (lectureId, data) {
    let alreadyExists = await this.findOne({ title: data.title, _id: { $ne: lectureId } });
    if (alreadyExists) {
        throw new Error('Title already exists');
    } else {
        const lecture = await this.findByIdAndUpdate(
            lectureId,
            data,
            { new: true, runValidators: true }
        );
        if (!lecture) {
            throw new Error('Lecture not found');
        }
        return lecture;
    }
}


module.exports = mongoose.model('Lecture', LectureSchema);