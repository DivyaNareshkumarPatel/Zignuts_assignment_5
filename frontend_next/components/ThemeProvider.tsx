'use client'; 
import { useEffect, ReactNode } from 'react';
import useThemeStore from '../store/themeStore';

interface ThemeProviderProps {
    children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const { theme } = useThemeStore();

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return <>{children}</>;
}