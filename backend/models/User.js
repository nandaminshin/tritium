const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    },
    profile_image: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superAdmin'],
        default: 'user'
    }
}, { timestamps: true });

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
        throw new Error('User does not exist');
    }

    let isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
        return user;
    } else {
        throw new Error('Password incorrect');
    }
}

UserSchema.statics.verifyToken = async function (token) {
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find user by id from decoded token
        const user = await this.findById(decoded._id).select('password');
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        }
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expired');
        }
        throw error;
    }
}

UserSchema.statics.updateUser = async function (id, updatedData) {
    const user = await this.findByIdAndUpdate(id, updatedData, { new: true });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

module.exports = mongoose.model('User', UserSchema);
