"use client"

import { useState, useEffect } from "react"
import ChatInterface from "@/components/dashboard/chat-interface"

export default function AIPage() {
  const [provider, setProvider] = useState<"auto" | "mock">("auto")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load provider preference from localStorage
    const saved = localStorage.getItem("ai-provider")
    if (saved === "mock" || saved === "auto") {
      setProvider(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("ai-provider", provider)
    }
  }, [provider, mounted])

  return (
    <div className="p-4 lg:p-8 h-full">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Get personalized productivity advice and time management tips
          </p>
        </div>

        {/* Provider Toggle */}
        {mounted && (
          <div className="bg-card rounded-lg border border-border p-3 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground mb-2">Provider:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setProvider("auto")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  provider === "auto"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Auto (API)
              </button>
              <button
                onClick={() => setProvider("mock")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  provider === "mock"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Mock
              </button>
            </div>
            {provider === "mock" && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                Using built-in responses
              </p>
            )}
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-240px)]">
        {/* Main Chat */}
        <div className="lg:col-span-2 h-full">
          {mounted && <ChatInterface forceMock={provider === "mock"} />}
        </div>

        {/* Sidebar with Tips */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto">
          {/* Quick Tips Card */}
          <div className="bg-card rounded-xl shadow-md p-6 border border-border">
            <h3 className="font-bold text-foreground mb-4">Productivity Tips</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-secondary font-bold flex-shrink-0">✓</span>
                <span className="text-foreground/80">Try the Pomodoro Technique: 25 min work + 5 min break</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary font-bold flex-shrink-0">✓</span>
                <span className="text-foreground/80">Block 90 min for deep work sessions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary font-bold flex-shrink-0">✓</span>
                <span className="text-foreground/80">Batch similar tasks to reduce context switching</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary font-bold flex-shrink-0">✓</span>
                <span className="text-foreground/80">Schedule breaks every 2 hours</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary font-bold flex-shrink-0">✓</span>
                <span className="text-foreground/80">Protect your deep work blocks</span>
              </li>
            </ul>
          </div>

          {/* Ask About Card */}
          <div className="bg-gradient-to-br from-accent/10 to-secondary/10 rounded-xl shadow-md p-6 border border-accent/20">
            <h3 className="font-bold text-foreground mb-3">You can ask me about:</h3>
            <div className="space-y-2 text-sm">
              <button className="w-full text-left px-3 py-2 rounded-lg bg-background/50 hover:bg-background text-foreground/80 hover:text-foreground transition-colors border border-border/50">
                Time management strategies
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-background/50 hover:bg-background text-foreground/80 hover:text-foreground transition-colors border border-border/50">
                Time blocking best practices
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-background/50 hover:bg-background text-foreground/80 hover:text-foreground transition-colors border border-border/50">
                Productivity techniques
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-background/50 hover:bg-background text-foreground/80 hover:text-foreground transition-colors border border-border/50">
                Schedule optimization
              </button>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-card rounded-xl shadow-md p-6 border border-border">
            <h3 className="font-bold text-foreground mb-3 text-sm">💡 Pro Tips</h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              The more details you share about your schedule and goals, the better personalized advice I can provide. Try asking about specific challenges you're facing!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
