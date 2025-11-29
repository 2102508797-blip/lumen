"use client"

import { motion } from "framer-motion"
import { Calendar, Sparkles } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ 
  title = "No tasks yet", 
  description = "Start planning your day by adding your first time block!",
  action
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6 text-muted-foreground/40"
      >
        <Calendar size={64} strokeWidth={1.5} />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
        {title}
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <Sparkles size={18} className="text-primary" />
        </motion.span>
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {description}
      </p>
      
      {action && (
        <motion.button
          onClick={action.onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
        >
          {action.label}
        </motion.button>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-xs text-muted-foreground"
      >
        💡 Tip: Drag on the timeline to quickly create blocks!
      </motion.div>
    </motion.div>
  )
}
