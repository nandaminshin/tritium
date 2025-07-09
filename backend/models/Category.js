const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

CategorySchema.statics.createCategory = async function (name) {
    const category = await this.create({ name });
    return category;
}

CategorySchema.statics.getAllCategories = async function () {
    const categories = await this.find({});
    return categories;
}

module.exports = mongoose.model('Category', CategorySchema);



