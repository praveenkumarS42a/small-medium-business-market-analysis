import React from 'react';
import { Header } from './Header';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {children}
            </main>
            <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>© {new Date().getFullYear()} SMB AI Index & Strategic Roadmap. All rights reserved.</p>
            </footer>
        </div>
    );
}
