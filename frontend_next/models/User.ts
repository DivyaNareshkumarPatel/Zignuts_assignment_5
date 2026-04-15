import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;