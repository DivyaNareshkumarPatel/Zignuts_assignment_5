'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBlog, fetchCategories, Category } from '@/lib/api';

export default function AddEditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = params.action !== 'new';

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        if (image) formData.append('imageThumbnail', image);

        try {
            await createBlog(formData);
            router.push('/admin/blogs');
        } catch (error) {
            console.error(error);
            alert("Failed to save blog.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border dark:border-gray-700">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Create New Blog</h1>
            
            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
                    <input 
                        type="text" required
                        className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                        value={title} onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select 
                        required
                        className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                        value={category} onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Featured Image</label>
                    <input 
                        type="file" accept="image/*"
                        className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} 
                    />
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Description / Content</label>
                    <textarea 
                        required rows={8}
                        className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                        value={description} onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>

                <button 
                    type="submit" disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                >
                    {loading ? 'Publishing...' : 'Publish Blog'}
                </button>
            </form>
        </div>
    );
}