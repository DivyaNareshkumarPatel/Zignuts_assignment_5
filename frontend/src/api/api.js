import axios from 'axios';

// Helper function to get auth headers
const getAuthHeaders = (isFile = false) => {
    const token = localStorage.getItem('adminToken');
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    if (!isFile) {
        headers['Content-Type'] = 'application/json';
    }
    
    return { headers };
};

// Category APIs
export const fetchCategories = async () => {
    const { data } = await axios.get('/api/admin/categories', getAuthHeaders());
    return data;
};

// Fetch single category by ID
export const createCategory = async (name) => {
    const { data } = await axios.post('/api/admin/categories', { name }, getAuthHeaders());
    return data;
};

// Update category by ID
export const updateCategory = async (id, name) => {
    const { data } = await axios.put(`/api/admin/categories/${id}`, { name }, getAuthHeaders());
    return data;
};

// Delete category by ID
export const deleteCategory = async (id) => {
    await axios.delete(`/api/admin/categories/${id}`, getAuthHeaders());
};

// Blog APIs
export const fetchAdminBlogs = async () => {
    const { data } = await axios.get('/api/admin/blogs', getAuthHeaders());
    return data;
};

// Fetch single blog by ID
export const fetchBlogById = async (id) => {
    const { data } = await axios.get(`/api/admin/blogs/${id}`, getAuthHeaders());
    return data;
};

// Create a new blog
export const createBlog = async (formData) => {
    const { data } = await axios.post('/api/admin/blogs', formData, getAuthHeaders(true)); 
    return data;
};

// Update a blog by ID
export const updateBlog = async (id, formData) => {
    const { data } = await axios.put(`/api/admin/blogs/${id}`, formData, getAuthHeaders(true)); 
    return data;
};

// Delete a blog by ID
export const deleteBlog = async (id) => {
    await axios.delete(`/api/admin/blogs/${id}`, getAuthHeaders());
};

// Public Blog APIs
export const fetchLatestBlogs = async () => {
    const { data } = await axios.get('/api/public/blogs/latest');
    return data;
};

// Fetch blog by slug
export const fetchBlogBySlug = async (slug) => {
    const { data } = await axios.get(`/api/public/blogs/${slug}`);
    return data;
};

// Search blogs
export const searchBlogs = async (query) => {
    const { data } = await axios.get(`/api/public/blogs/search?q=${query}`);
    return data;
};