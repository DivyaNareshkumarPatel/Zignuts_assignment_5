const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    role: {
        type: String,
        default: 'admin',
    },
}, {
    timestamps: true
});

UserSchema.methods.matchPassword = async function (enteredPassword) {

    return enteredPassword === this.password;
};

module.exports = mongoose.model('User', UserSchema);