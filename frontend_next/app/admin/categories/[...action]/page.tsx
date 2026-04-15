'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createCategory, updateCategory, fetchCategories } from '@/lib/api';
import Link from 'next/link';

export default function AddEditCategoryPage() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams(); 

    const actionArray = params.action as string[];
    const categoryId = actionArray[0] === 'edit' ? actionArray[1] : null;

    useEffect(() => {
        if (categoryId) {
            fetchCategories().then(cats => {
                const existing = cats.find(c => c._id === categoryId);
                if (existing) setName(existing.name);
            });
        }
    }, [categoryId]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (categoryId) {
                await updateCategory(categoryId, name); 
            } else {
                await createCategory(name);             
            }
            router.push('/admin/categories');
        } catch (error) {
            console.error(error);
            alert("Error saving category");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">
                    {categoryId ? 'Edit Category' : 'Add New Category'}
                </h1>
                <Link href="/admin/categories" className="text-blue-500 hover:underline">Back</Link>
            </div>

            <form onSubmit={submitHandler}>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Category Name</label>
                    <input 
                        type="text" required
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold">
                    {loading ? 'Saving...' : (categoryId ? 'Update Category' : 'Create Category')}
                </button>
            </form>
        </div>
    );
}