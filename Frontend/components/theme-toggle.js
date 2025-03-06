"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-[62px] h-[24px]"></div> 
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="theme-toggle"
        checked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="transition-all duration-300"
      />
      {theme === "dark" ? (
        <Sun 
          className="h-[1.2rem] w-[1.2rem] transition-all duration-700" 
          style={{ transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      ) : (
        <Moon 
          className="h-[1.2rem] w-[1.2rem] transition-all duration-700" 
          style={{ 
            transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)', 
            color: theme === "light" ? "#A1A1AA" : "currentColor",
            transform: theme === "light" ? "scale(0.75) rotate(12deg)" : "scale(1) rotate(0deg)"
          }}
        />
      )}
    </div>
  )
}