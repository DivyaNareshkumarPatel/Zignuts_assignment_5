import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useThemeStore from '../../store/themeStore'; // Import the store

// Icons
const Icons = {
    Dashboard: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    AddBlog: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Categories: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
    AddCategory: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Logout: () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    External: () => <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
    Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
};

const AdminDashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { theme, toggleTheme } = useThemeStore();

    const adminInfo = JSON.parse(localStorage.getItem('adminInfo')) || { username: 'Admin' };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        navigate('/admin-login');
    };

    const menuItems = [
        { name: 'All Blogs', path: '/admin/blogs', icon: <Icons.Dashboard /> },
        { name: 'Add New Blog', path: '/admin/blogs/new', icon: <Icons.AddBlog /> },
        { name: 'Categories', path: '/admin/categories', icon: <Icons.Categories /> },
        { name: 'Add Category', path: '/admin/categories/new', icon: <Icons.AddCategory /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 dark:bg-black text-white flex flex-col shadow-2xl z-20 transition-all duration-300">
                <div className="p-6 border-b border-gray-800 dark:border-gray-900">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                        Admin Panel
                    </h1>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Management Console</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-900/50'
                                        : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium text-sm tracking-wide">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800 dark:border-gray-900 bg-gray-900 dark:bg-black">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-red-400 bg-red-400/10 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 group"
                    >
                        <Icons.Logout />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 dark:border-gray-700 h-16 flex justify-between items-center px-8 shadow-sm transition-colors duration-300">

                    {/* Left side: Hello Admin */}
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {adminInfo.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 font-semibold text-gray-700 dark:text-gray-200">
                            Hello, {adminInfo.username}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
                        </button>

                        <Link
                            to="/"
                            className="flex items-center text-sm font-medium text-gray-500..."
                        >
                            View Public Site
                            <Icons.External />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto animate-fade-in-up">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;