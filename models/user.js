const { createHmac, randomBytes } = require('node:crypto');
const mongoose = require('mongoose');
const {createTokenForUser} = require('../services/authentication');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/defaultAvatar.png",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
})

userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static('matchedPasswordAndGenerateToken',async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('User not found!');
    } else {
        const salt = user.salt;
        const hashedPassword = user.password;
        const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');

        if (hashedPassword !== userProvidedHash) {
            throw new Error('Incorrect Password!');
        }
        const token = createTokenForUser(user);
        return token;
    }
});


const user = mongoose.model("users", userSchema);

module.exports = user;