"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, CheckCircle2, Circle, Trophy, Target, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import CelebrationConfetti from "@/components/dynamic/celebration-confetti"

interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  day: string
  priority: "high" | "medium" | "low"
}

export default function WeeklyTodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [selectedPriority, setSelectedPriority] = useState<"high" | "medium" | "low">("medium")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [showCelebration, setShowCelebration] = useState(false)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Load todos
  useEffect(() => {
    const stored = localStorage.getItem("weeklyTodos")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setTodos(parsed)
      } catch (e) {
        console.error("Failed to parse todos:", e)
      }
    }
  }, [])

  // Save todos whenever they change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("weeklyTodos", JSON.stringify(todos))
    }
  }, [todos])

  const handleAddTodo = () => {
    if (!newTitle.trim()) {
      toast.error("Please enter a task title")
      return
    }
    const todo: Todo = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      completed: false,
      day: selectedDay,
      priority: selectedPriority,
    }
    setTodos([...todos, todo])
    setNewTitle("")
    setNewDescription("")
    toast.success("✅ Task added!")
  }

  const handleToggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id)
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    
    if (!todo?.completed) {
      toast.success("🎉 Task completed! Keep it up!")
      
      // Check for milestones
      const completedCount = todos.filter(t => t.completed).length + 1
      if (completedCount % 10 === 0) {
        setShowCelebration(true)
        toast.success(`🏆 Milestone! ${completedCount} tasks completed!`, { duration: 4000 })
      }
    }
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
    toast.success("🗑️ Task deleted")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100/50 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100/50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100/50 text-green-700 border-green-200"
      default:
        return ""
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
    completionRate: todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0
  }

  return (
    <div className="p-4 lg:p-8">
      <CelebrationConfetti trigger={showCelebration} onComplete={() => setShowCelebration(false)} />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Target className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Weekly To-Do List</h1>
        </div>
        <p className="text-muted-foreground">Organize your tasks by day and priority</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Tasks", value: stats.total, icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Active", value: stats.active, icon: Circle, color: "text-secondary", bg: "bg-secondary/10" },
          { label: "Completion", value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className={`${stat.bg} rounded-xl p-5 border border-border shadow-md`}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={20} className={stat.color} />
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
            <motion.p 
              key={stat.value}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-foreground"
            >
              {stat.value}
            </motion.p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Todo Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl shadow-md p-6 border border-border lg:col-span-1 h-fit"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Plus size={20} />
            Add New Task
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add details"
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Day</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as any)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <motion.button
              onClick={handleAddTodo}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus size={20} />
              Add Task
            </motion.button>
          </div>
        </motion.div>

        {/* Tasks List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            {["all", "active", "completed"].map((f) => (
              <motion.button
                key={f}
                onClick={() => setFilter(f as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === f
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Tasks by Day */}
          <AnimatePresence mode="popLayout">
            {days.map((day) => {
              const dayTodos = filteredTodos.filter((todo) => todo.day === day)
              if (dayTodos.length === 0) return null

              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card rounded-xl shadow-md p-6 border border-border"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <span>{day}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      ({dayTodos.filter(t => t.completed).length}/{dayTodos.length})
                    </span>
                  </h3>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {dayTodos.map((todo, index) => (
                        <motion.div
                          key={todo.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 100 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                          className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                            todo.completed
                              ? "bg-muted/30 border-border/50 opacity-70"
                              : "bg-background border-border hover:border-secondary shadow-sm"
                          }`}
                        >
                          <motion.button
                            onClick={() => handleToggleTodo(todo.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="mt-1 text-secondary hover:text-secondary/80"
                          >
                            {todo.completed ? (
                              <CheckCircle2 size={22} className="text-green-600" />
                            ) : (
                              <Circle size={22} />
                            )}
                          </motion.button>
                          <div className="flex-1">
                            <p
                              className={`font-semibold text-base ${
                                todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {todo.title}
                            </p>
                            {todo.description && (
                              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                                {todo.description}
                              </p>
                            )}
                            <div className="flex gap-2 mt-3">
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                                  getPriorityColor(todo.priority)
                                }`}
                              >
                                {todo.priority}
                              </span>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => handleDeleteTodo(todo.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-destructive hover:text-destructive/80 mt-1 p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {filteredTodos.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-card rounded-xl border border-border"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              </motion.div>
              <p className="text-muted-foreground text-lg font-medium">No tasks found</p>
              <p className="text-sm text-muted-foreground mt-2">Create one to get started on your goals!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
