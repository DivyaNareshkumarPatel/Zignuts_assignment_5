import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { createCategory, updateCategory } from '../api/api.js';

// Simple SVG Icons
const Icons = {
    Back: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
    Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
    Tag: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
    Edit: () => <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Plus: () => <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
};

// Main Component
const AddEditCategory = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // Helper to get headers manually if needed (though API functions handle this usually)
    const getAuthHeaders = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        if (isEditMode) {
            const fetchCategory = async () => {
                setLoading(true);
                try {
                    // Direct axios call here as per your original code structure
                    const { data } = await axios.get(`/api/admin/categories/${id}`, getAuthHeaders());
                    setName(data.name);
                } catch (err) {
                    console.error(err);
                    setError('Failed to load category data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchCategory();
        } else {
            setLoading(false);
        }
    }, [id, isEditMode]);

    // Form submission handler
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEditMode) {
                await updateCategory(id, name);
                setSuccess('Category updated successfully');
            } else {
                await createCategory(name);
                setSuccess('Category created successfully');
                setName(''); 
            }
            setTimeout(() => navigate('/admin/categories'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading && isEditMode) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
    );

    // Main Render
    return (
        <div className="max-w-xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            {isEditMode ? <Icons.Edit /> : <Icons.Plus />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {isEditMode ? 'Edit Category' : 'Create New Category'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isEditMode ? 'Update existing category details' : 'Add a new category to your blog'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 flex items-center text-sm font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            {success}
                        </div>
                    )}
                    
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-center text-sm font-medium">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Category Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icons.Tag />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 font-medium"
                                    placeholder="e.g. Technology, Lifestyle..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-50">
                            <button 
                                type="button" 
                                onClick={() => navigate('/admin/categories')}
                                className="flex items-center px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                disabled={loading}
                            >
                                <span className="mr-2"><Icons.Back /></span>
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex items-center px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-lg shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <span className="mr-2"><Icons.Save /></span>
                                        Save Category
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEditCategory;