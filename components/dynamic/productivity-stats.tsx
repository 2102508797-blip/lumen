"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Clock, CheckCircle, Flame, Award, Calendar } from "lucide-react"

type TimeBlock = {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
}

export default function ProductivityStats() {
  const [stats, setStats] = useState({
    todayBlocks: 0,
    weekBlocks: 0,
    totalHours: 0,
    streak: 0,
  })

  useEffect(() => {
    // Load time blocks from localStorage
    const stored = localStorage.getItem("timeBlocks")
    if (stored) {
      try {
        const blocks: TimeBlock[] = JSON.parse(stored)
        calculateStats(blocks)
      } catch (e) {
        // ignore
      }
    }
  }, [])

  const calculateStats = (blocks: TimeBlock[]) => {
    const today = new Date()
    const todayStr = today.toISOString().slice(0, 10)
    
    // Get start of week
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const weekStartStr = startOfWeek.toISOString().slice(0, 10)

    let todayBlocks = 0
    let weekBlocks = 0
    let totalMinutes = 0

    blocks.forEach(block => {
      const blockDate = new Date(block.date).toISOString().slice(0, 10)
      
      if (blockDate === todayStr) {
        todayBlocks++
      }
      
      if (blockDate >= weekStartStr) {
        weekBlocks++
      }

      // Calculate duration
      const [startH, startM] = block.startTime.split(':').map(Number)
      const [endH, endM] = block.endTime.split(':').map(Number)
      const start = startH * 60 + startM
      const end = endH * 60 + endM
      totalMinutes += Math.max(0, end - start)
    })

    // Calculate streak (days with at least one block)
    const uniqueDates = new Set(blocks.map(b => new Date(b.date).toISOString().slice(0, 10)))
    let streak = 0
    let checkDate = new Date(today)
    
    while (streak < 30) { // Check up to 30 days
      const dateStr = checkDate.toISOString().slice(0, 10)
      if (uniqueDates.has(dateStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    setStats({
      todayBlocks,
      weekBlocks,
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      streak,
    })
  }

  const statCards = [
    {
      icon: Calendar,
      label: "Today's Blocks",
      value: stats.todayBlocks,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: TrendingUp,
      label: "This Week",
      value: stats.weekBlocks,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      icon: Clock,
      label: "Hours Planned",
      value: `${stats.totalHours}h`,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      icon: Flame,
      label: "Day Streak",
      value: stats.streak,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className={`${stat.bg} ${stat.border} border rounded-xl p-4 shadow-md cursor-default`}
        >
          <div className="flex items-start justify-between mb-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={stat.color}
            >
              <stat.icon size={24} />
            </motion.div>
            {stat.label === "Day Streak" && stats.streak > 0 && (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="text-2xl"
              >
                🔥
              </motion.span>
            )}
          </div>
          <motion.p
            key={stat.value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold text-foreground mb-1"
          >
            {stat.value}
          </motion.p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
