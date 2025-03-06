"use client"

import React from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { ThemeToggle } from './theme-toggle'
import { useTheme } from 'next-themes'

const Navbar = () => {
    const { theme } = useTheme()
    
    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white transition-colors">
                                Deatro AI
                            </span>
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-4">
                        <Link 
                            href="/" 
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link 
                            href="/Features" 
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Features 
                        </Link>
                        {/* <Link 
                            href="/pricing" 
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Pricing
                        </Link> */}
                        <ThemeToggle />
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar