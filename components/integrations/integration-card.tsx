"use client"

import { motion } from "framer-motion"
import { ExternalLink, Check } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface IntegrationCardProps {
  name: string
  description: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  connected?: boolean
  comingSoon?: boolean
  onConnect?: () => void
}

export default function IntegrationCard({
  name,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  connected = false,
  comingSoon = false,
  onConnect
}: IntegrationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-xl p-6 border border-border shadow-md hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
    >
      {comingSoon && (
        <div className="absolute top-3 right-3">
          <span className="bg-secondary/10 text-secondary text-xs font-semibold px-2 py-1 rounded-full border border-secondary/20">
            Coming Soon
          </span>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`${iconBg} ${iconColor} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
        >
          <Icon size={28} />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        {connected ? (
          <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
            <Check size={16} />
            <span>Connected</span>
          </div>
        ) : (
          <motion.button
            onClick={onConnect}
            disabled={comingSoon}
            whileHover={{ scale: comingSoon ? 1 : 1.05 }}
            whileTap={{ scale: comingSoon ? 1 : 0.95 }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              comingSoon
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
            }`}
          >
            <ExternalLink size={16} />
            <span>{comingSoon ? 'Coming Soon' : 'Connect'}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
