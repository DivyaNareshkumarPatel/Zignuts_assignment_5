'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createBlog, updateBlog, fetchBlogById, fetchCategories, Category } from '@/lib/api';

export default function AddEditBlogPage() {
    const router = useRouter();
    const params = useParams();

    const actionArray = params.action as string[];
    const blogId = actionArray[0] === 'edit' ? actionArray[1] : null;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(''); 
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);

                if (blogId) {
                    const blogData = await fetchBlogById(blogId);
                    setTitle(blogData.title);
                    setDescription(blogData.description);
                    setCategory(typeof blogData.category === 'object' ? (blogData.category as any)._id : blogData.category);
                    setCurrentImageUrl(blogData.imageThumbnail);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setPageLoading(false);
            }
        };
        loadData();
    }, [blogId]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        
        if (image) {
            formData.append('imageThumbnail', image);
        }

        try {
            if (blogId) {
                await updateBlog(blogId, formData);
            } else {
                await createBlog(formData);
            }
            router.push('/admin/blogs');
        } catch (error) {
            console.error(error);
            alert("Failed to save blog.");
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="p-8 text-center dark:text-white">Loading Editor...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">
                    {blogId ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h1>
                <Link href="/admin/blogs" className="text-blue-500 hover:underline">Back to Blogs</Link>
            </div>
            
            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block font-semibold mb-2 dark:text-white">Title</label>
                    <input 
                        type="text" required
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={title} onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2 dark:text-white">Category</label>
                    <select 
                        required
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={category} onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-2 dark:text-white">Featured Image</label>

                    {currentImageUrl && !image && (
                        <div className="mb-3">
                            <span className="text-sm text-gray-500 block mb-1">Current Image:</span>
                            <img src={currentImageUrl} alt="Current" className="h-24 object-cover rounded" />
                        </div>
                    )}
                    <input 
                        type="file" accept="image/*"
                        required={!blogId}
                        className="w-full text-sm dark:text-white"
                        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} 
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-2 dark:text-white">Content</label>
                    <textarea 
                        required rows={8}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={description} onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>

                <button 
                    type="submit" disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (blogId ? 'Update Blog' : 'Publish Blog')}
                </button>
            </form>
        </div>
    );
}