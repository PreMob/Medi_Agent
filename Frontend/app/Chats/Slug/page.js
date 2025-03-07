"use client"

import { useState, useRef, useEffect } from "react"
import { useUser } from "@clerk/nextjs" 
import { useCustomChat } from "@/lib/use-custom-chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PatientSidebar } from "@/components/chat-ui/patient-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Paperclip, Send, Stethoscope, User, Loader2, FileText, ImageIcon, Download, Tag, Trash2, Pin, X } from "lucide-react"

export default function Page({ params }) {
  const { slug } = params;
  
  return <MedicalChat slug={slug} />;
}

function MedicalChat({ slug }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, setMessages } = useCustomChat({
    onFinish: () => {
      setMessages(currentMessages => {
        saveChat(currentMessages);
        return currentMessages;
      });
    }
  });
  
  // Add this to get Clerk user data
  const { user, isLoaded: isUserLoaded } = useUser();
  
  const [selectedTag, setSelectedTag] = useState("");
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(["Medication", "Symptoms", "Diagnosis", "Follow-up", "General"]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [pinnedFiles, setPinnedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const savedPinnedFiles = localStorage.getItem("medical-chat-pinned-files");
    if (savedPinnedFiles) {
      try {
        setPinnedFiles(JSON.parse(savedPinnedFiles));
      } catch (e) {
        console.error("Failed to parse pinned files from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);
  
  // Handler functions
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit();
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };
  
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };
  
  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags(prev => [...prev, newTag]);
      setSelectedTag(newTag);
      setNewTag("");
    } else if (newTag && tags.includes(newTag)) {
      setSelectedTag(newTag);
      setNewTag("");
    }
  };
  
  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem("medical-chat");
    setShowClearConfirm(false);
  };
  
  const saveChat = (chatMessages) => {
    localStorage.setItem("medical-chat", JSON.stringify(chatMessages));
  };
  
  const exportAsText = () => {
    const text = messages.map(m => `${m.role === "user" ? "You" : "MedAssist"}: ${m.content}`).join("\n\n");
    downloadFile(text, "medical-chat.txt", "text/plain");
  };
  
  const exportAsJSON = () => {
    const json = JSON.stringify(messages, null, 2);
    downloadFile(json, "medical-chat.json", "application/json");
  };
  
  const downloadFile = (content, filename, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  
  const getFileCategory = (type) => {
    if (type.includes("pdf")) return "PDF";
    if (type.includes("image")) return "IMAGE";
    return "DOCUMENT";
  };
  
  const pinFile = (file) => {
    const fileType = getFileCategory(file.type);
    const newPinnedFile = { name: file.name, type: fileType };
    
    if (!pinnedFiles.some(f => f.name === file.name && f.type === fileType)) {
      const updatedPinnedFiles = [...pinnedFiles, newPinnedFile];
      setPinnedFiles(updatedPinnedFiles);
      localStorage.setItem("medical-chat-pinned-files", JSON.stringify(updatedPinnedFiles));
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="hidden md:block md:w-72 border-r bg-white dark:bg-neutral-900 dark:border-neutral-800">
        <ScrollArea className="h-full custom-scrollbar">
          <PatientSidebar />
        </ScrollArea>
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-neutral-950 max-w-[calc(100%-18rem)] md:max-w-full overflow-hidden">
        <div className="sticky top-0 z-10 border-b bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm transition-all duration-200 shadow-sm dark:border-neutral-800">
          <div className="flex items-center justify-between p-2 sm:p-3">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900/30 transition-all group-hover:ring-blue-300 dark:group-hover:ring-blue-800">
                  {/* Loading state while user data is being fetched */}
                  {!isUserLoaded ? (
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30">
                      <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400 animate-spin"></div>
                    </AvatarFallback>
                  ) : user?.imageUrl ? (
                    <AvatarImage 
                      src={user.imageUrl} 
                      alt={user.fullName || user.username || "User"} 
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {user ? (user.fullName?.charAt(0) || user.username?.charAt(0) || "U")
                           : (slug?.charAt(0)?.toUpperCase() || 'P')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-900"></span>
              </div>
              
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  {/* Loading state for user name */}
                  {!isUserLoaded ? (
                    <div className="w-32 h-6 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                  ) : (
                    <h2 className="text-lg font-semibold truncate dark:text-white">
                      {user?.fullName 
                        ? user.fullName 
                        : slug || 'Medical Consultation'}
                    </h2>
                  )}
                  {selectedTag && (
                    <Badge 
                      className="animate-fadeIn bg-blue-50 dark:bg-blue-800/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-300" 
                      variant="outline"
                    >
                      {selectedTag}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {!isUserLoaded ? (
                    <span className="inline-block w-24 h-4 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></span>
                  ) : (
                    `Active consultation • Last updated: ${new Date().toLocaleTimeString()}`
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-2 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <Tag className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Tags</span>
                  </Button>
                </DialogTrigger>
                <DialogContent 
                  className="dark:bg-neutral-900 dark:text-white dark:border-neutral-800 sm:max-w-[350px] w-[350px] mx-auto animate-in zoom-in-95 duration-200"
                  style={{
                    transformOrigin: 'center',
                    animationDuration: '150ms',
                    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <DialogHeader className="space-y-2">
                    <DialogTitle className="dark:text-white text-lg">Manage Tags</DialogTitle>
                    <DialogDescription className="dark:text-gray-400 text-sm">
                      Add tags to organize your medical conversations.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-3 py-3">
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700 h-9">
                        <SelectValue placeholder="Select a tag" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-neutral-800 dark:border-neutral-700">
                        {tags.map(tag => (
                          <SelectItem key={tag} value={tag} className="dark:text-white dark:focus:bg-neutral-700">{tag}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add new tag" 
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700 h-9"
                      />
                      <Button 
                        type="button" 
                        onClick={addTag} 
                        className="dark:bg-blue-700 dark:hover:bg-blue-600 h-9 px-3"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setSelectedTag("")}
                      className="dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white h-9 px-3"
                    >
                      Clear Selection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-2 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="animate-fadeIn dark:bg-neutral-800 dark:border-neutral-700">
                  <DropdownMenuItem onClick={exportAsText} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-neutral-700 dark:text-white transition-colors">
                    <FileText className="mr-2 h-4 w-4" /> Text File
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsJSON} className="cursor-pointer hover:bg-blue-50 dark:hover:bg-neutral-700 dark:text-white transition-colors">
                    <FileText className="mr-2 h-4 w-4" /> JSON File
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300 transition-colors duration-200"
                onClick={() => setShowClearConfirm(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="ml-1 hidden sm:inline">Clear</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Messages area - Fix scrolling here */}
        <div className="flex-1 overflow-y-auto scrollable-content p-4 w-full">
          {/* Pinned files with dark mode */}
          {pinnedFiles.length > 0 && (
            <div className="mb-4 p-2 border border-blue-100 dark:border-blue-900/30 rounded-lg bg-blue-50/50 dark:bg-blue-950/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center">
                  <Pin className="h-3.5 w-3.5 mr-1.5" /> Pinned Files
                </h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  onClick={() => {
                    setPinnedFiles([]);
                    localStorage.removeItem("medical-chat-pinned-files");
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {pinnedFiles.map((file, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-800 border border-blue-200 dark:border-blue-900/30 rounded-md py-1 px-2 text-xs text-blue-700 dark:text-blue-400">
                          {file.type === 'PDF' && <FileText className="h-3.5 w-3.5" />}
                          {file.type === 'IMAGE' && <ImageIcon className="h-3.5 w-3.5" />}
                          {file.type === 'DOCUMENT' && <FileText className="h-3.5 w-3.5" />}
                          <span className="truncate max-w-[80px]">{file.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={5} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                        <p>{file.type}: {file.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}
        
          {/* Empty state with dark mode */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 max-w-[800px] mx-auto py-8">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold dark:text-white">Welcome to MedAssist AI</h3>
              <p className="text-muted-foreground dark:text-gray-400 max-w-md">
                I'm your medical assistant, ready to help with medical questions, symptom analysis, and health information.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 w-full max-w-lg px-4">
                <Button variant="outline" className="justify-start dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300 dark:hover:bg-neutral-800 h-11 text-base">
                  <User className="mr-2 h-4 w-4" /> Patient information
                </Button>
                <Button variant="outline" className="justify-start dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300 dark:hover:bg-neutral-800 h-11 text-base">
                  <FileText className="mr-2 h-4 w-4" /> Medical history
                </Button>
                <Button variant="outline" className="justify-start dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300 dark:hover:bg-neutral-800 h-11 text-base">
                  <Stethoscope className="mr-2 h-4 w-4" /> Symptom checker
                </Button>
                <Button variant="outline" className="justify-start dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300 dark:hover:bg-neutral-800 h-11 text-base">
                  <Paperclip className="mr-2 h-4 w-4" /> Upload test results
                </Button>
              </div>
            </div>
          ) : (
            /* Message bubbles with dark mode */
            messages.map((message) => (
              <div 
                key={message.id}
                className={cn(
                  "mb-4 flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex items-end gap-2 max-w-[85%]",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}>
                  {message.role !== "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-blue-600 text-white">AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className={cn(
                      "text-sm font-medium mb-1 dark:text-gray-300",
                      message.role === "user" ? "text-right" : "text-left"
                    )}>
                      {message.role === "user" ? "You" : "MedAssist AI"}
                    </div>
                    <div className={cn(
                      "rounded-lg p-3 break-words",
                      message.role === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 dark:bg-neutral-800 dark:text-gray-100"
                    )}>
                      {message.content}
                    </div>
                  </div>
                  
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-gray-400 dark:bg-gray-600">U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area with dark mode */}
        <div className="p-3 border-t bg-white dark:bg-neutral-900 dark:border-neutral-800 w-full">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-2 mx-auto w-full max-w-3xl">
            {/* File attachments preview with dark mode */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-800 rounded-lg py-1 px-2">
                    {file.type.includes("image") ? (
                      <ImageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                    <span className="text-sm truncate max-w-[120px] dark:text-gray-200">{file.name}</span>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/30" 
                              onClick={(e) => {
                                e.stopPropagation();
                                pinFile(file);
                              }}
                            >
                              <Pin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={5} className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                            <p>Pin {getFileCategory(file.type)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0 dark:text-gray-400 dark:hover:text-gray-200" 
                        onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="relative flex w-full">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your medical question here..."
                className="min-h-11 pr-20 resize-none dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:placeholder-gray-400 w-full rounded-2xl"
                rows={1}
                disabled={isLoading}
              />
              
              <div className="absolute right-1.5 bottom-1.5 flex gap-1.5">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        disabled={isLoading}
                        onClick={handleFileButtonClick}
                        className="dark:text-gray-400 dark:hover:text-white dark:hover:bg-neutral-700 h-8 w-8"
                      >
                        <Paperclip className="h-5 w-5" />
                        <span className="sr-only">Attach files</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="dark:bg-neutral-800 dark:text-white dark:border-neutral-700">
                      <p>Attach files</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="rounded-full dark:bg-blue-700 dark:hover:bg-blue-600 h-8 w-8"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Alert Dialog with dark mode */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent 
          className="dark:bg-neutral-900 dark:border-neutral-800 sm:max-w-[350px] w-[350px] mx-auto animate-in zoom-in-95 duration-200"
          style={{
            transformOrigin: 'center',
            animationDuration: '150ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="dark:text-white text-lg">Clear Conversation</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400 text-sm">
              Are you sure you want to clear this conversation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2 pt-2">
            <AlertDialogCancel className="dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 h-9 mt-0 flex-1">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={clearConversation} 
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 h-9 flex-1"
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}