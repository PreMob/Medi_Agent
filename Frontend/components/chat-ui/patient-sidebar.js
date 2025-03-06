"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs" // Add this import
import { Calendar, ClipboardList, User, MessageSquare, Stethoscope, Utensils, Search, History, Plus, ChevronDown, ArrowRight, X, Sparkles} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Animations
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}

const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.3 }
}

export function PatientSidebar() {
  // Add this to get Clerk user data
  const { user, isLoaded: isUserLoaded } = useUser();
  
  const [activeAgent, setActiveAgent] = useState("doctor")
  const [expandedSection, setExpandedSection] = useState("chats")
  const [recentChats, setRecentChats] = useState([
    { id: 1, title: "Medication Review", date: "2h ago", unread: true },
    { id: 2, title: "Diet Plan Discussion", date: "Yesterday", unread: false },
    { id: 3, title: "Symptom Assessment", date: "Mar 2, 2025", unread: false },
  ])

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!isUserLoaded || !user) return "U";
    if (user.fullName) {
      return user.fullName.split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user.username?.substring(0, 2).toUpperCase() || "U";
  }

  return (
    <ScrollArea className="h-full dark:bg-neutral-900">
      <div className="p-4 space-y-6">
        {/* Patient Profile */}
        <motion.div 
          className="relative flex flex-col items-center space-y-2 pb-4 border-b dark:border-neutral-800"
          {...fadeIn}
        >
          <div className="absolute top-0 right-0">
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 animate-pulse">
              Online
            </Badge>
          </div>
          
          <Avatar className="h-20 w-20 ring-4 ring-blue-100 dark:ring-blue-900/30 transition-all duration-300 hover:ring-blue-300 dark:hover:ring-blue-800">
            {/* Loading state while user data is being fetched */}
            {!isUserLoaded ? (
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30">
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400 animate-spin"></div>
              </AvatarFallback>
            ) : user?.imageUrl ? (
              <AvatarImage 
                src={user.imageUrl} 
                alt={user.fullName || user.username || "User"} 
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                {getUserInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="text-center">
            {/* Loading state for user name */}
            {!isUserLoaded ? (
              <>
                <div className="w-28 h-5 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mx-auto mb-2"></div>
                <div className="w-36 h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mx-auto"></div>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg dark:text-white">
                  {user ? (user.fullName || user.username || "User") : "No User"}
                </h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  {user?.emailAddresses?.[0]?.emailAddress 
                    ? user.emailAddresses[0].emailAddress 
                    : "Patient ID: #12345"}
                </p>
              </>
            )}
          </div>
          
          <div className="flex gap-2 mt-2 w-full">
            <Button variant="outline" size="sm" className="flex-1 transition-all hover:bg-blue-50 hover:text-blue-600 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400">
              <User className="mr-1 h-4 w-4" />
              Profile
            </Button>
            <Button variant="outline" size="sm" className="flex-1 transition-all hover:bg-blue-50 hover:text-blue-600 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400">
              <Calendar className="mr-1 h-4 w-4" />
              Schedule
            </Button>
          </div>
        </motion.div>

        {/* Agent Selection */}
        <motion.div className="space-y-3" {...slideIn}>
          <h4 className="text-sm font-medium mb-2 flex items-center dark:text-gray-300">
            <Sparkles className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
            Select Assistant
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={activeAgent === "doctor" ? "default" : "outline"}
              className={cn(
                "h-auto flex-col py-3 px-2 transition-all duration-300",
                activeAgent === "doctor" 
                  ? "bg-blue-600 dark:bg-blue-700" 
                  : "hover:bg-blue-50 hover:text-blue-600 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
              )}
              onClick={() => setActiveAgent("doctor")}
            >
              <Stethoscope className={cn(
                "h-6 w-6 mb-1",
                activeAgent === "doctor" ? "text-white" : "text-blue-600 dark:text-blue-400"
              )} />
              <span className="text-xs">Doctor</span>
            </Button>
            
            <Button 
              variant={activeAgent === "diet" ? "default" : "outline"}
              className={cn(
                "h-auto flex-col py-3 px-2 transition-all duration-300",
                activeAgent === "diet" 
                  ? "bg-green-600 dark:bg-green-700" 
                  : "hover:bg-green-50 hover:text-green-600 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-green-900/30 dark:hover:text-green-400"
              )}
              onClick={() => setActiveAgent("diet")}
            >
              <Utensils className={cn(
                "h-6 w-6 mb-1",
                activeAgent === "diet" ? "text-white" : "text-green-600 dark:text-green-400"
              )} />
              <span className="text-xs">Nutritionist</span>
            </Button>
            
            <Button 
              variant={activeAgent === "symptoms" ? "default" : "outline"}
              className={cn(
                "h-auto flex-col py-3 px-2 transition-all duration-300",
                activeAgent === "symptoms" 
                  ? "bg-amber-600 dark:bg-amber-700" 
                  : "hover:bg-amber-50 hover:text-amber-600 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
              )}
              onClick={() => setActiveAgent("symptoms")}
            >
              <Search className={cn(
                "h-6 w-6 mb-1",
                activeAgent === "symptoms" ? "text-white" : "text-amber-600 dark:text-amber-400"
              )} />
              <span className="text-xs">Symptoms</span>
            </Button>
            
            <Button 
              variant={activeAgent === "general" ? "default" : "outline"}
              className={cn(
                "h-auto flex-col py-3 px-2 transition-all duration-300",
                activeAgent === "general" 
                  ? "bg-purple-600 dark:bg-purple-700" 
                  : "hover:bg-purple-50 hover:text-purple-600 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-400"
              )}
              onClick={() => setActiveAgent("general")}
            >
              <MessageSquare className={cn(
                "h-6 w-6 mb-1",
                activeAgent === "general" ? "text-white" : "text-purple-600 dark:text-purple-400"
              )} />
              <span className="text-xs">General</span>
            </Button>
          </div>
        </motion.div>

        {/* Chat History */}
        <motion.div 
          className="space-y-1 border rounded-lg overflow-hidden dark:border-neutral-800"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: expandedSection === "chats" ? "auto" : 42,
            opacity: 1
          }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors dark:text-gray-200"
            onClick={() => toggleSection("chats")}
          >
            <div className="flex items-center">
              <History className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">Chat History</span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              expandedSection === "chats" ? "transform rotate-180" : ""
            )} />
          </button>
          
          {expandedSection === "chats" && (
            <div className="p-2 space-y-2 animate-fadeIn dark:bg-neutral-700">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Recent conversations</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:text-gray-400 dark:hover:text-white">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              {recentChats.map(chat => (
                <motion.div 
                  key={chat.id} 
                  className="bg-white dark:bg-neutral-800 p-2 rounded-md border dark:border-neutral-700 cursor-pointer hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-700 dark:hover:bg-blue-900/30 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium dark:text-gray-200">{chat.title}</p>
                        {chat.unread && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{chat.date}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity dark:text-gray-400" />
                  </div>
                </motion.div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full text-xs justify-center dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800">
                View all history
              </Button>
            </div>
          )}
        </motion.div>

        
        {/* Quick Actions */}
        <motion.div className="space-y-2 pt-2" {...slideIn} initial={{ delay: 0.3 }}>
          <h4 className="text-sm font-medium mb-2 dark:text-gray-300">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-auto py-3 justify-center hover:bg-green-50 hover:text-green-600 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-green-900/30 dark:hover:text-green-400 transition-all">
              <ClipboardList className="h-4 w-4 mr-2" />
              <span className="text-xs">Records</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </ScrollArea>
  )
}