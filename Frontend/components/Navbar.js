"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { ThemeToggle } from './theme-toggle'
import { useTheme } from 'next-themes'
import { motion } from "framer-motion"
import { Home, Layout } from "lucide-react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

/**
 * @property {React.ReactNode} icon 
 * @property {string} label 
 * @property {string} href
 * @property {string} gradient 
 * @property {string} iconColor
 */

const menuItems = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Home",
    href: "/",
    gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: <Layout className="h-5 w-5" />,
    label: "Features",
    href: "/Features",
    gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
    iconColor: "text-purple-500",
  },
]

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
}

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
}

// Custom Tooltip components
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipContent = React.forwardRef(({ className, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    className="z-50 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    {...props}
  />
))
TooltipContent.displayName = "TooltipContent"

const Navbar = () => {
    const { theme } = useTheme()
    const isDarkTheme = theme === "dark"
    
    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-lg rounded-b-xl transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image 
                                src="/logo.svg" 
                                alt="AI Logo" 
                                width={100} 
                                height={90}
                                className="mr-2 rounded-md"
                            />
                            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                                MedAI 
                            </span>
                        </Link>
                    </div>
                    
                    <div className="hidden md:flex items-center">
                        <TooltipProvider>
                            <motion.div
                                className="p-3 rounded-2xl backdrop-blur-lg relative overflow-hidden flex items-center"
                                initial="initial"
                                whileHover="hover"
                            >
                                <motion.div
                                    className={`absolute -inset-2 bg-gradient-radial from-transparent ${
                                        isDarkTheme
                                            ? "via-blue-400/30 via-30% via-purple-400/30 via-60% via-red-400/30 via-90%"
                                            : "via-blue-400/20 via-30% via-purple-400/20 via-60% via-red-400/20 via-90%"
                                    } to-transparent rounded-3xl z-0 pointer-events-none`}
                                    variants={navGlowVariants}
                                />
                                <ul className="flex items-center gap-2 relative z-10">
                                    {menuItems.map((item, index) => (
                                        <motion.li key={item.label} className="relative">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <motion.div
                                                        className="block rounded-xl overflow-visible group relative"
                                                        style={{ perspective: "600px" }}
                                                        whileHover="hover"
                                                        initial="initial"
                                                    >
                                                        <motion.div
                                                            className="absolute inset-0 z-0 pointer-events-none"
                                                            variants={glowVariants}
                                                            style={{
                                                                background: item.gradient,
                                                                opacity: 0,
                                                                borderRadius: "16px",
                                                            }}
                                                        />
                                                        <motion.div
                                                            variants={itemVariants}
                                                            transition={sharedTransition}
                                                            style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
                                                        >
                                                            <Link 
                                                                href={item.href}
                                                                className="flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors rounded-xl"
                                                            >
                                                                <span className={`transition-colors duration-300 group-hover:${item.iconColor} drop-shadow-md`}>
                                                                    {item.icon}
                                                                </span>
                                                                <span className="text-sm font-medium">{item.label}</span>
                                                            </Link>
                                                        </motion.div>
                                                        <motion.div
                                                            variants={backVariants}
                                                            transition={sharedTransition}
                                                            style={{ 
                                                                transformStyle: "preserve-3d", 
                                                                transformOrigin: "center top", 
                                                                position: "absolute",
                                                                inset: 0,
                                                                rotateX: 90 
                                                            }}
                                                        >
                                                            <Link 
                                                                href={item.href}
                                                                className="flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors rounded-xl h-full"
                                                            >
                                                                <span className={`transition-colors duration-300 group-hover:${item.iconColor} drop-shadow-md`}>
                                                                    {item.icon}
                                                                </span>
                                                                <span className="text-sm font-medium">{item.label}</span>
                                                            </Link>
                                                        </motion.div>
                                                    </motion.div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{item.label}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </TooltipProvider>
                        <div className="flex items-center ml-4 space-x-4">
                            <ThemeToggle />
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar