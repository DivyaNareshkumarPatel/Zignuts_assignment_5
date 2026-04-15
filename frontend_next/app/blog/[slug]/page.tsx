import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogBySlug } from '@/lib/api';
import ThemeToggleButton from '@/components/ThemeToggleButton';

const Icons = {
    Back: () => (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
    Calendar: () => (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    )
};
interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogDetailsPage({ params }: PageProps) {
    const { slug } = await params;
    const blog = await fetchBlogBySlug(slug);

    if (!blog) {
        notFound(); 
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">

            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link 
                        href="/" 
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
                    >
                        <Icons.Back />
                        Back to Articles
                    </Link>
                    
                    <ThemeToggleButton />
                </div>
            </nav>

            <article>
                <header className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900">
                        <img 
                            src={blog.imageFeatured || blog.imageThumbnail} 
                            alt={blog.title} 
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    </div>
                    
                    {/* Header Text Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto w-full">
                        <div className="mb-4">
                            <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                {typeof blog.category === 'object' ? (blog.category as any).name : 'General'}
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

                <div className="max-w-3xl mx-auto px-5 py-12 md:py-20">
                    <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 dark:text-gray-200 leading-relaxed font-serif transition-colors">
                        <div 
                            className="whitespace-pre-wrap first-letter:text-5xl first-letter:font-bold first-letter:text-green-700 dark:first-letter:text-green-500 first-letter:mr-3 first-letter:float-left"
                            dangerouslySetInnerHTML={{ __html: blog.description }}
                        />
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-gray-500 dark:text-gray-400 italic text-center md:text-left">
                            Published in <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {typeof blog.category === 'object' ? (blog.category as any).name : 'General'}
                            </span>
                        </p>
                    </div>
                </div>
            </article>

        </div>
    );
}