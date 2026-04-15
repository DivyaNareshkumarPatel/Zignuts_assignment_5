import mongoose, { Schema } from 'mongoose';

const BlogSchema = new Schema({
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

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export default Blog;