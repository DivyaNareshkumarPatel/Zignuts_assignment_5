const Category = require('../models/Category');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a new category
const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        const category = new Category({ name });
        await category.save();
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.deleteOne();
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a category by ID
const updateCategory = async (req, res) => {
    const {name} = req.body;
    const {id} = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.name = name || category.name;
        await category.save();
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory,
};