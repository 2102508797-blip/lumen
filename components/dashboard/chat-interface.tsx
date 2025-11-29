"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Loader2, Sparkles, Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void
  forceMock?: boolean
}

export default function ChatInterface({ onSendMessage, forceMock = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm powered by ChatGPT (GPT-4o-mini) 🤖 I can help you with time management, productivity tips, scheduling advice, and general questions. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Call callback if provided
    if (onSendMessage) {
      onSendMessage(inputValue)
    }

    try {
      // Prepare conversation history for ChatGPT
      const conversationMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))
      
      // Add the new user message
      conversationMessages.push({
        role: "user",
        content: inputValue,
      })

      // Call the ChatGPT API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages,
          model: "gpt-4o-mini",
        }),
      })

      // Handle empty or invalid JSON responses
      let data
      try {
        const text = await response.text()
        if (!text) {
          throw new Error("Empty response from server")
        }
        data = JSON.parse(text)
      } catch (parseError: any) {
        console.error("JSON Parse Error:", parseError)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ Server error: Unable to parse response. The server might be starting up or experiencing issues. Please try again in a moment.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.details || "Failed to get response from ChatGPT"
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `❌ Error: ${errorMessage}. Please try again or contact support if the issue persists.`,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
        return
      }

      // Add ChatGPT response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data?.message || data?.response || "I received your message but couldn't generate a response.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error("Chat error:", error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ Connection error: ${error.message || "Unable to reach ChatGPT"}. Please check your internet connection and try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold"
          >
            <Sparkles size={20} />
          </motion.div>
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              AI Assistant
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs"
              >
                💬
              </motion.span>
            </h2>
            <p className="text-xs text-muted-foreground">I'm here to help you be more productive!</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary flex-shrink-0"
                >
                  <Brain size={18} />
                </motion.div>
              )}

            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none border border-border"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
              <p
                className={`text-xs mt-1.5 ${
                  message.role === "user"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {message.timestamp.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

              {message.role === "user" && (
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0 text-sm font-semibold"
                >
                  👤
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3 items-start"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary flex-shrink-0"
              >
                <Brain size={18} />
              </motion.div>
              <div className="bg-muted text-foreground rounded-lg rounded-bl-none px-4 py-2 border border-border">
                <motion.p 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sm text-muted-foreground"
                >
                  Thinking... 💭
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-border bg-muted/30 p-4 backdrop-blur-sm"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about productivity, time management..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
