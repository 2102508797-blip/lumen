"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function ThemeToggleSimple() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-muted rounded-full" />
    )
  }

  return (
    <motion.button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex h-7 w-14 items-center rounded-full bg-muted transition-colors hover:bg-muted/80"
      aria-label="Toggle theme"
    >
      <motion.span
        animate={{
          x: theme === "dark" ? 28 : 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="inline-block h-6 w-6 transform rounded-full bg-primary shadow-lg"
      />
    </motion.button>
  )
}
