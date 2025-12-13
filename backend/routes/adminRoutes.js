const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware.js');
const router = express.Router();

// Import controllers
const { 
    createCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory,
    getCategoryById
} = require('../controller/categoryController.js');

const { 
    createBlog, 
    getAdminBlogs, 
    getBlogById, 
    updateBlog, 
    deleteBlog 
} = require('../controller/blogController.js');

const { upload } = require('../utils/fileUpload.js');

// Blog Routes
router.route('/blogs')
    .get(protect, admin, getAdminBlogs)
    .post(
        protect,
        admin,
        upload.fields([
            { name: 'imageThumbnail', maxCount: 1 },
            { name: 'imageFeatured', maxCount: 1 }
        ]),
        createBlog
    );

router.route('/blogs/:id')
    .get(protect, admin, getBlogById)
    .put(
        protect,
        admin,
        upload.fields([
            { name: 'imageThumbnail', maxCount: 1 },
            { name: 'imageFeatured', maxCount: 1 }
        ]),
        updateBlog
    )
    .delete(protect, admin, deleteBlog);

// Category Routes
router.route('/categories')
    .get(protect, admin, getCategories)
    .post(protect, admin, createCategory);

router.route('/categories/:id')
    .get(protect, admin, getCategoryById)
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

module.exports = router;