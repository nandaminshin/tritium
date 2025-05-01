const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.statics.register = async function (name, email, password) {
    let salt = await bcrypt.genSalt();
    let hashPassword = await bcrypt.hash(password, salt);

    let user = await this.create({
        name,
        email,
        password: hashPassword
    });

    return user;
}

UserSchema.statics.login = async function (email, password) {
    let user = await this.findOne({ email });
    if (!user) {
        throw new Error('user doen not exist');
    }

    let isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
        return user;
    } else {
        throw new Error('Password incorrect');
    }
}

module.exports = mongoose.model('User', UserSchema);
