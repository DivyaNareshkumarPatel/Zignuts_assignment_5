'use client'; 
import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; 
import ThemeToggleButton from '@/components/ThemeToggleButton';

interface AdminInfo {
    username: string;
    role?: string;
    _id?: string;
    token?: string;
}

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
 
    const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const infoString = localStorage.getItem('adminInfo');
        
        if (!token || !infoString) {
            router.push('/admin-login'); 
        } else {
            setAdminInfo(JSON.parse(infoString) as AdminInfo);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        router.push('/admin-login');
    };

    if (!adminInfo) return <div className="p-10 text-center dark:text-white">Loading Security Checks...</div>;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center px-8 text-gray-900 dark:text-white">
                    <span>Hello, {adminInfo.username}</span>
                    <div className="flex items-center gap-4">
                        <ThemeToggleButton />
                        <Link href="/" target="_blank" className="hover:text-green-500">View Public Site</Link>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8 text-gray-900 dark:text-gray-100">
                    {children} 
                </main>
            </div>
        </div>
    );
}