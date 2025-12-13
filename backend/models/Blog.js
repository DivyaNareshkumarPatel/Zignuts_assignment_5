const mongoose = require('mongoose');

// Blog Schema
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: true,
    },
    description: {
        type: String,
        required: [true, 'Blog content is required'],
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
    imageThumbnail: {
        type: String,
        required: true,
    },
    imageFeatured: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Blog', BlogSchema);