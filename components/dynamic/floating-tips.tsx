"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lightbulb } from "lucide-react"

const TIPS = [
  "💡 Tip: Drag on the timeline to quickly create time blocks!",
  "🎯 Pro Tip: Schedule your most important tasks during your peak energy hours.",
  "⏰ Remember: Include buffer time between tasks to avoid rushing.",
  "🧠 Did you know? 90-minute focus blocks align with your natural attention cycle.",
  "✨ Try this: Review your calendar every evening to plan tomorrow.",
  "🔥 Success habit: Build a consistent morning routine with time blocking.",
]

export default function FloatingTips() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasSeenTips, setHasSeenTips] = useState(false)

  useEffect(() => {
    // Check if user has seen tips
    const seen = localStorage.getItem("hasSeenFloatingTips")
    if (seen) {
      setHasSeenTips(true)
      return
    }

    // Show first tip after 3 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(initialTimer)
  }, [])

  useEffect(() => {
    if (!isVisible || hasSeenTips) return

    // Auto-rotate tips every 8 seconds
    const interval = setInterval(() => {
      setCurrentTip(prev => {
        const next = (prev + 1) % TIPS.length
        if (next === 0) {
          // Seen all tips, don't show again
          setIsVisible(false)
          localStorage.setItem("hasSeenFloatingTips", "true")
          setHasSeenTips(true)
        }
        return next
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [isVisible, hasSeenTips])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("hasSeenFloatingTips", "true")
    setHasSeenTips(true)
  }

  return (
    <AnimatePresence>
      {isVisible && !hasSeenTips && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-2xl shadow-2xl p-4 pr-12 border border-primary/20">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0 mt-0.5"
              >
                <Lightbulb size={20} />
              </motion.div>
              <motion.p
                key={currentTip}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm leading-relaxed"
              >
                {TIPS[currentTip]}
              </motion.p>
            </div>
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex gap-1 mt-3">
              {TIPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index === currentTip ? 'bg-primary-foreground' : 'bg-primary-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
