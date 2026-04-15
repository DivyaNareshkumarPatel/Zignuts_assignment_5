import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlogBySlug } from '../../api/api';
import useThemeStore from '../../store/themeStore';

// Icon Components
const Icons = {
    Back: () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
    Calendar: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Category: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
    Error: () => <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
};

const BlogDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        const loadBlog = async () => {
            try {
                const data = await fetchBlogBySlug(slug);
                setBlog(data);
            } catch (err) {
                setError("We couldn't find the blog post you're looking for.");
            } finally {
                setLoading(false);
            }
        };
        loadBlog();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    if (error || !blog) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center transition-colors">
            <Icons.Error />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Page Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">{error}</p>
            <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all"
            >
                Back to Home
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">
                        <Icons.Back />
                        Back to Articles
                    </Link>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
                    </button>
                </div>
            </nav>

            <article>
                {/* Featured Image Header */}
                <header className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900">
                        <img
                            src={blog.imageFeatured || blog.imageThumbnail}
                            alt={blog.title}
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto w-full">
                        <div className="mb-4">
                            <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                {blog.category?.name || 'General'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 text-shadow-sm">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap items-center text-gray-300 text-sm md:text-base gap-6">
                            <div className="flex items-center">
                                <Icons.Calendar />
                                {new Date(blog.publishDate).toLocaleDateString(undefined, {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <div className="max-w-3xl mx-auto px-5 py-12 md:py-20">
                    <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 dark:text-gray-200 leading-relaxed font-serif transition-colors">
                        <div
                            className="whitespace-pre-wrap first-letter:text-5xl first-letter:font-bold first-letter:text-green-700 dark:first-letter:text-green-500 first-letter:mr-3 first-letter:float-left"
                            dangerouslySetInnerHTML={{ __html: blog.description }}
                        />
                    </div>

                    {/* Footer / Category info */}
                    <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-gray-500 dark:text-gray-400 italic text-center md:text-left">
                            Published in <span className="font-semibold text-gray-800 dark:text-gray-200">{blog.category?.name}</span>
                        </p>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogDetailsPage;