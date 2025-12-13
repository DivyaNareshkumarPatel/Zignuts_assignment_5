const express = require('express');
const router = express.Router();
const { getLatestBlogs, getBlogBySlug, searchBlogs } = require('../controller/blogController.js');

// Public Blog Routes
router.get('/blogs/latest', getLatestBlogs);
router.get('/blogs/search', searchBlogs); 
router.get('/blogs/:slug', getBlogBySlug);

module.exports = router;