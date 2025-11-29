"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Brain, Target, Zap } from "lucide-react"

const MOTIVATIONAL_QUOTES = [
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Time blocking isn't about being busy, it's about being intentional.", author: "Cal Newport" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "You don't need more time, you need more focus.", author: "Unknown" },
  { text: "The key is not to prioritize your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "Small daily improvements are the key to long-term results.", author: "Unknown" },
]

const TIME_GREETINGS = [
  { start: 0, end: 5, greeting: "Burning the midnight oil?", emoji: "🌙", message: "Rest is productive too!" },
  { start: 5, end: 12, greeting: "Good morning", emoji: "🌅", message: "Perfect time to plan your day!" },
  { start: 12, end: 17, greeting: "Good afternoon", emoji: "☀️", message: "Keep that momentum going!" },
  { start: 17, end: 21, greeting: "Good evening", emoji: "🌆", message: "Wrapping up? Review your wins!" },
  { start: 21, end: 24, greeting: "Good night", emoji: "🌃", message: "Tomorrow's another opportunity!" },
]

export default function MotivationalHeader() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [greeting, setGreeting] = useState({ greeting: "", emoji: "", message: "" })
  const [userName, setUserName] = useState("there")

  useEffect(() => {
    // Get user name
    const user = localStorage.getItem("currentUser")
    if (user) {
      try {
        const userData = JSON.parse(user)
        setUserName(userData.name || "there")
      } catch (e) {
        // ignore
      }
    }

    // Set greeting based on time
    const hour = new Date().getHours()
    const timeGreeting = TIME_GREETINGS.find(g => hour >= g.start && hour < g.end)
    if (timeGreeting) {
      setGreeting(timeGreeting)
    }

    // Rotate quotes every 10 seconds
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const quote = MOTIVATIONAL_QUOTES[currentQuote]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Personalized Greeting */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 shadow-lg mb-4">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-4"
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-4xl"
          >
            {greeting.emoji}
          </motion.span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {greeting.greeting}, {userName}! 👋
            </h2>
            <p className="text-sm text-muted-foreground">{greeting.message}</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-primary"
          >
            <Sparkles size={24} />
          </motion.div>
        </motion.div>
      </div>

      {/* Rotating Motivational Quote */}
      <motion.div
        key={currentQuote}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-xl p-5 border border-border shadow-md"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-secondary flex-shrink-0"
          >
            <Brain size={20} />
          </motion.div>
          <div className="flex-1">
            <p className="text-sm text-foreground/90 italic leading-relaxed mb-2">
              "{quote.text}"
            </p>
            <p className="text-xs text-muted-foreground">— {quote.author}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Action Hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-4 flex flex-wrap gap-2"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-xs font-medium border border-secondary/20 cursor-default"
        >
          <Target size={14} />
          <span>Plan your day wisely</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium border border-primary/20 cursor-default"
        >
          <Zap size={14} />
          <span>Focus on what matters</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
