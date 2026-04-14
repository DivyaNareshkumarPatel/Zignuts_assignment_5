import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLatestBlogs, searchBlogs } from '../../api/api';
import useThemeStore from '../../store/themeStore';

// Icon Components (Added Sun and Moon)
const Icons = {
    Search: () => <svg className="w-5 h-5 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Calendar: () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    ArrowRight: () => <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
    Empty: () => <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
    Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
};

// Main Component
const BlogListPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);


    useEffect(() => {
        const loadBlogs = async () => {
            setLoading(true);
            try {
                let data;
                if (!debouncedQuery.trim()) {
                    data = await fetchLatestBlogs();
                } else {
                    data = await searchBlogs(debouncedQuery);
                }
                setBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs", error);
            } finally {
                setLoading(false);
            }
        };
        loadBlogs();
    }, [debouncedQuery]);

    // Render the blog list page
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            
            {/* Top Navigation Bar for Toggle & Login */}
            <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="font-bold text-xl text-green-600 dark:text-green-400">MyBlog</div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
                        </button>
                        <Link 
                            to="/admin-login" 
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-white dark:bg-gray-800 overflow-hidden transition-colors duration-300 border-b border-gray-100 dark:border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 opacity-50"></div>
                <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                    <span className="text-green-600 dark:text-green-400 font-bold tracking-wider uppercase text-sm mb-2">Welcome to the Blog</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight transition-colors">
                        Discover Stories, <br className="hidden md:block"/> Ideas, and Trends.
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-10 transition-colors">
                        Explore the latest articles on technology, lifestyle, and coding. Stay updated with curated content just for you.
                    </p>
                    <div className="relative w-full max-w-lg group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Icons.Search />
                        </div>
                        <input 
                            type="text" 
                            className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl leading-5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 shadow-sm transition-all duration-200"
                            placeholder="Search for articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                             <span className="text-gray-400 dark:text-gray-400 text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1">Type to search</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content List */}
            <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles'}
                    </h2>
                    {!loading && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {blogs.length} {blogs.length === 1 ? 'Post' : 'Posts'} Found
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse transition-colors">
                                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {blogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogs.map((blog) => (
                                    <article 
                                        key={blog._id} 
                                        className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                                    >
                                        <div className="relative h-56 overflow-hidden bg-gray-200 dark:bg-gray-700">
                                            <img 
                                                src={blog.imageThumbnail} 
                                                alt={blog.title} 
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-block bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                                                    {blog.category?.name || 'General'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mb-3">
                                                <Icons.Calendar />
                                                {new Date(blog.publishDate).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                                                <Link to={`/blog/${blog.slug}`}>
                                                    {blog.title}
                                                </Link>
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                                {blog.description.replace(/<[^>]*>?/gm, '')}
                                            </p>

                                            <Link 
                                                to={`/blog/${blog.slug}`} 
                                                className="inline-flex items-center text-sm font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors mt-auto"
                                            >
                                                Read Full Story
                                                <Icons.ArrowRight />
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                                <Icons.Empty />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No blogs found</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    We couldn't find any articles matching "{searchQuery}".
                                </p>
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="mt-6 px-6 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 py-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} MyBlog Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default BlogListPage;