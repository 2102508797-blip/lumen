"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, CheckSquare, Mail, User, Sparkles, Menu, X, ChevronLeft, ChevronRight, Flame, Home } from "lucide-react"
import { useEffect } from "react"

const navItems = [
  { href: "/dashboard", label: "Calendar", icon: Calendar },
  { href: "/dashboard/weekly-todo", label: "Weekly To-Do", icon: CheckSquare },
  { href: "/dashboard/streak", label: "Streak", icon: Flame },
  { href: "/dashboard/inbox", label: "Inbox", icon: Mail },
  { href: "/dashboard/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        setUserName(parsed.name || "User")
      } catch (e) {
        console.error("Failed to parse user data:", e)
      }
    }
  }, [])
  
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    // Emit event for layout to listen
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sidebar-collapse', { 
        detail: { isCollapsed: newState } 
      }))
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="lg:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between"
      >
        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center cursor-pointer"
          >
            <User size={18} />
          </motion.div>
          <span className="font-bold cursor-pointer">{userName}</span>
        </Link>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-primary-foreground"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </motion.div>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ 
          width: isCollapsed ? 80 : 256,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } lg:block fixed top-16 lg:top-0 left-0 bottom-0 bg-primary text-primary-foreground transition-all duration-200 z-40 h-screen flex flex-col overflow-hidden`}
      >
        {/* User Profile Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden lg:flex items-center gap-2 p-6 border-b border-primary/20 relative"
        >
          {!isCollapsed ? (
            <Link href="/dashboard" className="flex items-center gap-3 flex-1">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
              >
                <User size={24} />
              </motion.div>
              <div className="cursor-pointer overflow-hidden">
                <h1 className="font-bold text-base truncate">{userName}</h1>
                <p className="text-xs text-primary-foreground/60">Go to Calendar</p>
              </div>
            </Link>
          ) : (
            <Link href="/dashboard" className="mx-auto">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center cursor-pointer"
              >
                <User size={20} />
              </motion.div>
            </Link>
          )}
          
          {/* Collapse Toggle Button */}
          <motion.button
            onClick={toggleCollapse}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center shadow-lg border-2 border-primary"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </motion.button>
        </motion.div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <motion.li 
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                      isActive
                        ? "bg-secondary text-secondary-foreground shadow-md"
                        : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary/60"
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <Icon size={20} />
                    </motion.div>
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-secondary-foreground rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    )}
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed lg:hidden top-16 left-0 right-0 bottom-0 bg-black/50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
