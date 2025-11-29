"use client"

import { useEffect, useState } from "react"
import Confetti from "react-confetti"

interface CelebrationConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

export default function CelebrationConfetti({ trigger, onComplete }: CelebrationConfettiProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (trigger) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
        onComplete?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  if (!showConfetti) return null

  return (
    <Confetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.3}
    />
  )
}
