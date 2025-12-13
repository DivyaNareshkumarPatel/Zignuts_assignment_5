const Blog = require('../models/Blog');
const slugify = require('slugify');

// Create a new blog
const createBlog = async (req, res) => {
    const { title, category, description, publishDate } = req.body;
    
    const thumbnailUrl = req.files && req.files.imageThumbnail ? req.files.imageThumbnail[0].path : null;
    const featuredURL = req.files && req.files.imageFeatured ? req.files.imageFeatured[0].path : null;

    if(!title || !category || !description || !publishDate || !thumbnailUrl || !featuredURL){
        return  res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const slug = slugify(title, { lower: true, strict: true });
        const newBlog = new Blog({
            title,
            slug,
            category,
            description,
            publishDate,
            imageThumbnail: thumbnailUrl,
            imageFeatured: featuredURL,
            author: req.user._id,
        });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        console.error("Error creating blog:", error); // Log the error to console
        res.status(500).json({ message: 'Server Error' });
    }
};


// Get all blogs for admin dashboard
const getAdminBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .populate('category', 'name')
            .select('title category description publishDate')
            .sort({ publishDate: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getLatestBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .populate('category', 'name')
            .select('title category description publishDate imageThumbnail slug') // Added slug here so links work
            .sort({ publishDate: -1 })
            .limit(5);
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug })
            .populate('category', 'name')
            .select('-author -createdAt -updatedAt');

        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const searchBlogs = async (req, res) => {
    try {
        const keyword = req.query.q ? {
            title: { $regex: req.query.q, $options: 'i' }
        } : {};

        const blogs = await Blog.find({ ...keyword })
            .populate('category', 'name')
            .select('title slug category imageThumbnail description publishDate');
        
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('category', 'name');
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        await blog.deleteOne();
        res.json({ message: 'Blog removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const { title, category, description, publishDate } = req.body;

        // Update fields if provided
        blog.title = title || blog.title;
        blog.category = category || blog.category;
        blog.description = description || blog.description;
        blog.publishDate = publishDate || blog.publishDate;

        if (title) {
            blog.slug = slugify(title, { lower: true, strict: true });
        }

        // Update images ONLY if new ones are uploaded
        if (req.files && req.files.imageThumbnail) {
            blog.imageThumbnail = req.files.imageThumbnail[0].path;
        }
        if (req.files && req.files.imageFeatured) {
            blog.imageFeatured = req.files.imageFeatured[0].path;
        }

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createBlog,
    getAdminBlogs,
    getLatestBlogs,
    getBlogBySlug,
    searchBlogs,
    getBlogById,
    deleteBlog,
    updateBlog
};