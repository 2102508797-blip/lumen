"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/dashboard/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/")
    }
    setIsLoading(false)
    
    // Listen for sidebar collapse events
    const handleSidebarCollapse = (e: CustomEvent) => {
      setIsCollapsed(e.detail.isCollapsed)
    }
    
    window.addEventListener('sidebar-collapse', handleSidebarCollapse as EventListener)
    
    return () => {
      window.removeEventListener('sidebar-collapse', handleSidebarCollapse as EventListener)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main 
        className="transition-all duration-300 lg:min-h-screen overflow-auto"
        style={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (isCollapsed ? '80px' : '256px') : '0'
        }}
      >
        {children}
      </main>
    </div>
  )
}
