"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (!email || !password) {
        setError("Please fill in all fields")
        setIsLoading(false)
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email")
        setIsLoading(false)
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      // Store user in localStorage
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split("@")[0],
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("currentUser", JSON.stringify(userData))
      router.push("/dashboard")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex flex-col">
      {/* Top nav */}
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-primary rounded-lg shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">SC</span>
            </div>
            <span className="font-semibold text-sm md:text-base text-foreground tracking-tight">
              Luman
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <button type="button" className="hover:text-foreground transition-colors">
              Product
            </button>
            <button type="button" className="hover:text-foreground transition-colors">
              Calendar
            </button>
            <button type="button" className="hover:text-foreground transition-colors">
              Pricing
            </button>
            <button type="button" className="hover:text-foreground transition-colors">
              Docs
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 shadow-sm transition-colors"
            >
              Get Luman free
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-6xl w-full space-y-10">
          {/* Hero row */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
            {/* Hero / product intro */}
            <section className="space-y-7 animate-in fade-in-0 duration-500">
              {/* bubble avatars row */}
              <div className="inline-flex items-center gap-2 rounded-full bg-card/70 border border-border px-3 py-1 shadow-sm">
                <div className="flex -space-x-2">
                  {["🧠", "📅", "✅", "⏰"].map((emoji) => (
                    <div
                      key={emoji}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border text-base"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  Your classes, tasks & deadlines in one place
                </span>
              </div>

              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3 leading-tight">
                  One schedule.
                  <br className="hidden sm:block" />
                  Zero chaos.
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-xl">
                  Luman is your smart schedule manager that syncs tasks with your calendar, helps you
                  time-block your day, and keeps you ahead of every exam, meeting and deadline.
                </p>
              </div>

              {/* key bullets */}
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 border border-border shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  AI-assisted daily plan in seconds
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 border border-border shadow-sm">
                  📅 Auto-sync with your calendar
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 border border-border shadow-sm">
                  ✅ Habit & task streaks that actually stick
                </span>
              </div>

              {/* mini “app window” preview */}
              <div className="mt-2 hidden md:block">
                <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden transform transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl">
                  <div className="flex items-center gap-1 border-b border-border px-4 py-2 text-xs text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-3">Today · Luman</span>
                  </div>
                  <div className="p-4 space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Task I</p>
                        <p className="text-xs text-muted-foreground">Blocked by Luman</p>
                      </div>
                      <span className="text-xs text-muted-foreground">9:00 – 11:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Task II</p>
                        <p className="text-xs text-muted-foreground">Lab · Campus</p>
                      </div>
                      <span className="text-xs text-muted-foreground">2:00 – 4:00</span>
                    </div>
                    <div className="rounded-lg border border-dashed border-border/80 px-3 py-2 text-muted-foreground text-xs flex items-center justify-between">
                      <span>Add an exam, task or event…</span>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                        /new
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Auth card */}
            <section className="w-full max-w-md lg:justify-self-end animate-in slide-in-from-bottom-4 duration-500">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-2xl shadow-xl p-8 border border-border"
              >
                <div className="mb-6">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    {isSignUp ? "Get started free" : "Welcome back"}
                  </p>
                  <h2 className="text-2xl font-semibold text-foreground mb-1">
                    {isSignUp ? "Create your Luman account" : "Log in to Luman"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    No credit card. Just your email and a password.
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 rounded-lg bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2 text-sm rounded-md font-medium transition-all ${
                      !isSignUp
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2 text-sm rounded-md font-medium transition-all ${
                      isSignUp
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="@example.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-sm hover:shadow-md"
                  >
                    {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Continue"}
                  </button>
                </form>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  By continuing, you agree to our Terms and Privacy Policy.
                </p>
              </motion.div>

              {/* Demo credentials */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-center text-xs text-muted-foreground bg-muted/60 rounded-lg p-3 border border-border/80"
              >
                <p className="font-medium mb-1">Try the demo workspace:</p>
                <p>Email: demo@example.com · Password: 123456</p>
              </motion.div>
            </section>
          </div>

          {/* Product intro section */}
          <section className="grid gap-4 md:grid-cols-3 text-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-2">
                Plan
              </p>
              <h3 className="font-semibold text-foreground mb-1">Design your perfect day</h3>
              <p className="text-muted-foreground text-xs">
                Drag blocks, set focus sessions, and let Luman auto-fill your free time with the
                tasks that matter most.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-2">
                Sync
              </p>
              <h3 className="font-semibold text-foreground mb-1">Stay aligned with your calendar</h3>
              <p className="text-muted-foreground text-xs">
                Luman mirrors your Google/Apple calendar so classes, exams, labs and meetings all
                live in one clean view.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-card border border-border rounded-xl p-4 shadow-sm"
            >
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-2">
                Grow
              </p>
              <h3 className="font-semibold text-foreground mb-1">Build real consistency</h3>
              <p className="text-muted-foreground text-xs">
                Track streaks, weekly reviews and focus time so you can actually see your habits and
                skills compounding.
              </p>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/80">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>Trusted by students and small teams who hate schedule chaos.</span>
          <div className="flex flex-wrap gap-3 opacity-80">
            <span>NST</span>
            <span>construct</span>
            <span>damn</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
