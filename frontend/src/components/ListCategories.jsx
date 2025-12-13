import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, deleteCategory } from '../api/api.js';

// SVG Icons
const Icons = {
    Plus: () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
    Edit: () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    Trash: () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Collection: () => <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    Warning: () => <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
};

// Main Component
const ListCategories = () => {
    // State Variables
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for Custom Delete Modal
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const navigate = useNavigate();

    // Fetch Categories
    const loadCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to fetch categories.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // Open the modal instead of window.confirm
    const openDeleteModal = (id) => {
        setCategoryToDelete(id);
        setDeleteModalOpen(true);
    };

    // Close the delete confirmation modal
    const closeDeleteModal = () => {
        setCategoryToDelete(null);
        setDeleteModalOpen(false);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        
        try {
            await deleteCategory(categoryToDelete);
            setCategories(categories.filter(cat => cat._id !== categoryToDelete));
            closeDeleteModal();
        } catch (err) {
            setError('Failed to delete category.');
            console.error(err);
            closeDeleteModal();
        }
    };

    // Loading and Error States
    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center">
            <span className="mr-2 font-bold">Error:</span> {error}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 relative">
            
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
                        <div className="text-center">
                            <Icons.Warning />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Category?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete this category? 
                                <br/>
                                <span className="text-xs text-red-500 font-semibold mt-1 block">This action cannot be undone.</span>
                            </p>
                            
                            <div className="flex space-x-3 justify-center">
                                <button 
                                    onClick={closeDeleteModal}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/30 transition-all"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
                    <p className="text-sm text-gray-500 mt-1">Organize your blog posts into topics</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/categories/new')}
                    className="mt-4 sm:mt-0 flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg hover:shadow-green-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                    <Icons.Plus />
                    Add New Category
                </button>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50/80 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-500 font-mono">
                                                {new Date(category.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => navigate(`/admin/categories/edit/${category._id}`)}
                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Icons.Edit />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(category._id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Icons.Trash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Icons.Collection />
                                            <p className="text-gray-500 text-lg font-medium">No categories found</p>
                                            <p className="text-gray-400 text-sm mt-1">Start by adding a new topic for your blogs.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListCategories;