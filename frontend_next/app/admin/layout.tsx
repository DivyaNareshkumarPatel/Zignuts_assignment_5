'use client'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { signOut, useSession, SessionProvider } from 'next-auth/react';
import ThemeToggleButton from '@/components/ThemeToggleButton';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-xl font-semibold dark:text-white">Verifying Security...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold text-green-400">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/blogs" className={`block px-4 py-3 rounded-xl transition-colors ${pathname === '/admin/blogs' ? 'bg-green-600' : 'hover:bg-gray-800'}`}>Blogs</Link>
                    <Link href="/admin/categories" className={`block px-4 py-3 rounded-xl transition-colors ${pathname === '/admin/categories' ? 'bg-green-600' : 'hover:bg-gray-800'}`}>Categories</Link>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={() => signOut({ callbackUrl: '/admin-login' })} 
                        className="w-full p-3 text-red-400 font-bold hover:bg-gray-800 rounded-xl transition-colors text-left"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center px-8 text-gray-900 dark:text-white">
                    <span>Hello, {session?.user?.name || 'Admin'}</span>
                    <div className="flex items-center gap-4">
                        <ThemeToggleButton />
                        <Link href="/" target="_blank" className="hover:text-green-500 font-medium">View Public Site</Link>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8 text-gray-900 dark:text-gray-100">
                    {children} 
                </main>
            </div>
        </div>
    );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </SessionProvider>
    );
}