'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ThemeToggleButton from '@/components/ThemeToggleButton';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('123456'); 
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });

        if (result?.error) {
            console.log(result.error)
            setError("Invalid username or password");
            setLoading(false);
            setTimeout(() => setError(null), 5000);
        } else {
            window.location.href = '/admin/blogs';
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="absolute top-6 right-6">
                <ThemeToggleButton />
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition-colors">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-green-700 dark:text-green-500">Admin Login</h2>
                
                {loading && <p className="text-center text-green-600 dark:text-green-400 font-medium mb-4">Authenticating...</p>}
                
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition duration-200 font-bold text-lg shadow-lg disabled:opacity-50"
                        disabled={loading}
                    >
                        Login
                    </button>
                </form>
            </div>
            
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-2xl z-50 animate-bounce">
                    <div className="font-bold mb-1">Login Error</div>
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}