'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCategories, deleteCategory, Category } from '@/lib/api';

export default function ListCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchCategories();
            setCategories(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            await deleteCategory(id);
            setCategories(categories.filter(c => c._id !== id));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Categories</h1>
                <Link href="/admin/categories/new" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Add Category</Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 dark:text-white">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700 dark:text-gray-300">
                        {categories.map((cat) => (
                            <tr key={cat._id}>
                                <td className="p-4">{cat.name}</td>
                                <td className="p-4 text-right">
                                    <Link href={`/admin/categories/edit/${cat._id}`} className="text-blue-500 mr-4">Edit</Link>
                                    <button onClick={() => handleDelete(cat._id)} className="text-red-500">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}