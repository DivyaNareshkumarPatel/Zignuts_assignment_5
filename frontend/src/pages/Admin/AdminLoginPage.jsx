import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Admin Login Page Component
const AdminLoginPage = () => {
    // State variables
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('123456'); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Navigation hook
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (localStorage.getItem('adminToken')) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    // Form submission handler
    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // API call to login
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post(
                '/api/auth/admin/login',
                { username, password },
                config
            );

            // Store token and admin info in local storage
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminInfo', JSON.stringify(data)); 

            setLoading(false);
            navigate('/admin/dashboard');

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Invalid Credentials or Server Error'); 
            setLoading(false);
            setTimeout(() => setError(null), 5000);
        }
    };

    // Render the login form
    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-green-700">Admin Login</h2>
                
                {loading && <p className="text-center text-green-600 font-medium mb-4">Loading...</p>}
                
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        Login
                    </button>
                </form>
            </div>
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-2xl max-w-sm z-50 transition-transform duration-300 transform animate-slide-in-right">
                    <div className="font-bold mb-1">Login Error</div>
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default AdminLoginPage;