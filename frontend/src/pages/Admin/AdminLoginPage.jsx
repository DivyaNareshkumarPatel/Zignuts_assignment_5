import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../../store/themeStore'; 
const Icons = {
    Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
};

const AdminLoginPage = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('123456'); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { theme, toggleTheme } = useThemeStore();
    useEffect(() => {
        if (localStorage.getItem('adminToken')) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

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

            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminInfo', JSON.stringify(data)); 

            setLoading(false);
            navigate('/admin/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Credentials or Server Error'); 
            setLoading(false);
            setTimeout(() => setError(null), 5000);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="absolute top-6 right-6">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                    {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
                </button>
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
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition duration-200 font-bold text-lg shadow-lg disabled:opacity-50"
                        disabled={loading}
                    >
                        Login
                    </button>
                </form>
            </div>
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-2xl max-w-sm z-50 animate-bounce">
                    <div className="font-bold mb-1">Login Error</div>
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default AdminLoginPage;