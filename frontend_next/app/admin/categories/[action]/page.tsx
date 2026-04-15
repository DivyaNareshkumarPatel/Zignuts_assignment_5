'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createCategory, updateCategory, fetchCategories } from '@/lib/api';

export default function AddEditCategoryPage() {
    const [name, setName] = useState('');
    const router = useRouter();
    const params = useParams();
    const categoryId = params.action !== 'new' ? params.action as string : null;

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
        if (categoryId) {
            await updateCategory(categoryId, name);
        } else {
            await createCategory(name);
        }
        router.push('/admin/categories');
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border dark:border-gray-700">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">
                {categoryId ? 'Edit Category' : 'Add Category'}
            </h1>
            <form onSubmit={submitHandler}>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
                    <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold">
                    {categoryId ? 'Update' : 'Create'} Category
                </button>
            </form>
        </div>
    );
}