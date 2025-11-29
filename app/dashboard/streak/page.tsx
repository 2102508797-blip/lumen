"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Plus, Trash2, Check, X, Calendar as CalendarIcon, Trophy, TrendingUp } from "lucide-react"
import toast from "react-hot-toast"

type Activity = {
  id: string
  name: string
  duration: number // in minutes
  durationUnit: string
}

type DailyLog = {
  date: string // YYYY-MM-DD
  completedActivities: string[] // activity IDs
}

type StreakData = {
  activities: Activity[]
  logs: DailyLog[]
}

type HistoryView = "week" | "month" | "year"
type StreakView = "overall" | "activity"

export default function StreakPage() {
  const [streakData, setStreakData] = useState<StreakData>({
    activities: [],
    logs: []
  })
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [newActivityName, setNewActivityName] = useState("")
  const [newActivityDuration, setNewActivityDuration] = useState("30")
  const [newActivityUnit, setNewActivityUnit] = useState("minutes")
  const [historyView, setHistoryView] = useState<HistoryView>("week")
  const [streakView, setStreakView] = useState<StreakView>("overall")

  // Load streak data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("streakData")
    if (stored) {
      setStreakData(JSON.parse(stored))
    }
  }, [])

  // Save streak data to localStorage
  useEffect(() => {
    localStorage.setItem("streakData", JSON.stringify(streakData))
  }, [streakData])

  const getTodayString = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayString = getTodayString()
  const todayLog = streakData.logs.find(log => log.date === todayString)

  const handleAddActivity = () => {
    if (!newActivityName.trim()) {
      toast.error("Please enter an activity name")
      return
    }

    const newActivity: Activity = {
      id: Date.now().toString(),
      name: newActivityName.trim(),
      duration: parseInt(newActivityDuration),
      durationUnit: newActivityUnit
    }

    setStreakData(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }))

    setNewActivityName("")
    setNewActivityDuration("30")
    setNewActivityUnit("minutes")
    setIsAddingActivity(false)
    toast.success("🎯 Activity added to your streak goals!")
  }

  const handleDeleteActivity = (activityId: string) => {
    const activity = streakData.activities.find(a => a.id === activityId)
    setStreakData(prev => ({
      activities: prev.activities.filter(a => a.id !== activityId),
      logs: prev.logs.map(log => ({
        ...log,
        completedActivities: log.completedActivities.filter(id => id !== activityId)
      }))
    }))
    toast.success(`🗑️ "${activity?.name}" removed from streak`)
  }

  const handleToggleActivity = (activityId: string) => {
    const todayLog = streakData.logs.find(log => log.date === todayString)
    
    if (!todayLog) {
      // Create new log for today
      setStreakData(prev => ({
        ...prev,
        logs: [...prev.logs, { date: todayString, completedActivities: [activityId] }]
      }))
      toast.success("✅ Great job! Keep the streak going!")
    } else {
      // Update existing log
      const isCompleted = todayLog.completedActivities.includes(activityId)
      setStreakData(prev => ({
        ...prev,
        logs: prev.logs.map(log => 
          log.date === todayString 
            ? {
                ...log,
                completedActivities: isCompleted
                  ? log.completedActivities.filter(id => id !== activityId)
                  : [...log.completedActivities, activityId]
              }
            : log
        )
      }))
      
      if (isCompleted) {
        toast("Activity unchecked", { icon: "↩️" })
      } else {
        toast.success("✅ Awesome! Activity completed!")
      }
    }
  }

  const isActivityCompleted = (activityId: string) => {
    return todayLog?.completedActivities.includes(activityId) || false
  }

  // Calculate current streak (overall - all activities)
  const calculateOverallStreak = () => {
    if (streakData.activities.length === 0) return 0
    
    const sortedLogs = [...streakData.logs].sort((a, b) => b.date.localeCompare(a.date))
    let streak = 0
    let checkDate = new Date()
    
    for (let i = 0; i < 365; i++) {
      const year = checkDate.getFullYear()
      const month = String(checkDate.getMonth() + 1).padStart(2, '0')
      const day = String(checkDate.getDate()).padStart(2, '0')
      const checkDateString = `${year}-${month}-${day}`
      
      const log = sortedLogs.find(l => l.date === checkDateString)
      
      // Check if all activities were completed on this day
      if (log && log.completedActivities.length === streakData.activities.length) {
        streak++
      } else if (i > 0) {
        // If not the first day and not all completed, break streak
        break
      }
      
      checkDate.setDate(checkDate.getDate() - 1)
    }
    
    return streak
  }

  // Calculate streak for a specific activity
  const calculateActivityStreak = (activityId: string) => {
    const sortedLogs = [...streakData.logs].sort((a, b) => b.date.localeCompare(a.date))
    let streak = 0
    let checkDate = new Date()
    
    for (let i = 0; i < 365; i++) {
      const year = checkDate.getFullYear()
      const month = String(checkDate.getMonth() + 1).padStart(2, '0')
      const day = String(checkDate.getDate()).padStart(2, '0')
      const checkDateString = `${year}-${month}-${day}`
      
      const log = sortedLogs.find(l => l.date === checkDateString)
      
      // Check if this specific activity was completed
      if (log && log.completedActivities.includes(activityId)) {
        streak++
      } else if (i > 0) {
        break
      }
      
      checkDate.setDate(checkDate.getDate() - 1)
    }
    
    return streak
  }

  const currentStreak = calculateOverallStreak()
  const todayProgress = streakData.activities.length > 0 
    ? Math.round((todayLog?.completedActivities.length || 0) / streakData.activities.length * 100)
    : 0

  // Get historical days based on view
  const getHistoricalDays = (view: HistoryView) => {
    const days = []
    let numDays = 7
    if (view === "month") numDays = 30
    if (view === "year") numDays = 365
    
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
      const log = streakData.logs.find(l => l.date === dateString)
      const allCompleted = streakData.activities.length > 0 && 
        log?.completedActivities.length === streakData.activities.length
      
      days.push({
        date: dateString,
        day: date.getDate(),
        month: date.getMonth() + 1,
        weekday: date.toLocaleDateString(undefined, { weekday: 'short' }),
        completed: allCompleted
      })
    }
    return days
  }

  const historicalDays = getHistoricalDays(historyView)

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Flame className="w-8 h-8 text-orange-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Streak Tracker</h1>
        </div>
        <p className="text-muted-foreground">Build habits one day at a time</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          {/* Current Streak Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8" />
              <Trophy className="w-6 h-6 opacity-80" />
            </div>
            <div className="text-center">
              <motion.div
                key={currentStreak}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl font-bold mb-2"
              >
                {currentStreak}
              </motion.div>
              <p className="text-lg font-semibold opacity-90">Day Streak</p>
              <p className="text-sm opacity-75 mt-2">
                {currentStreak > 0 ? "Keep it up! 🔥" : "Start your streak today!"}
              </p>
            </div>
          </motion.div>

          {/* Today's Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl shadow-md p-6 border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Today's Progress</h3>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-bold text-foreground">{todayProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${todayProgress}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {todayLog?.completedActivities.length || 0} of {streakData.activities.length} activities completed
            </p>
          </motion.div>

          {/* History View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl shadow-md p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">History</h3>
              </div>
            </div>
            
            {/* View Toggle Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setHistoryView("week")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  historyView === "week"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                data-testid="history-week-btn"
              >
                Week
              </button>
              <button
                onClick={() => setHistoryView("month")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  historyView === "month"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                data-testid="history-month-btn"
              >
                Month
              </button>
              <button
                onClick={() => setHistoryView("year")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  historyView === "year"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                data-testid="history-year-btn"
              >
                Year
              </button>
            </div>
            
            {/* Calendar Grid */}
            <div className={`grid gap-2 max-h-96 overflow-y-auto ${
              historyView === "week" ? "grid-cols-7" :
              historyView === "month" ? "grid-cols-10" :
              "grid-cols-12"
            }`}>
              {historicalDays.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(0.3 + index * 0.01, 0.8) }}
                  className="text-center"
                  title={day.date}
                >
                  {historyView === "week" && (
                    <p className="text-xs text-muted-foreground mb-1">{day.weekday.charAt(0)}</p>
                  )}
                  <div
                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      day.completed
                        ? "bg-green-500 dark:bg-green-600 text-white shadow-md"
                        : "bg-muted dark:bg-muted/50 text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {day.completed ? <Check size={historyView === "year" ? 12 : 16} /> : historyView === "year" ? "" : day.day}
                  </div>
                  {historyView === "month" && day.day === 1 && (
                    <p className="text-xs text-muted-foreground mt-1">{new Date(day.date).toLocaleDateString(undefined, { month: 'short' })}</p>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {historyView === "week" && "Last 7 days"}
                {historyView === "month" && "Last 30 days"}
                {historyView === "year" && "Last 365 days"}
                {" • "}
                {historicalDays.filter(d => d.completed).length} days completed
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Activities */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-xl shadow-lg p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Today's Activities</h2>
              <motion.button
                onClick={() => setIsAddingActivity(!isAddingActivity)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                data-testid="add-activity-button"
              >
                {isAddingActivity ? <X size={18} /> : <Plus size={18} />}
                {isAddingActivity ? "Cancel" : "Add Activity"}
              </motion.button>
            </div>

            {/* Add Activity Form */}
            <AnimatePresence>
              {isAddingActivity && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Activity Name
                      </label>
                      <input
                        type="text"
                        value={newActivityName}
                        onChange={(e) => setNewActivityName(e.target.value)}
                        placeholder="e.g., Exercise, Reading, Meditation"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        data-testid="activity-name-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Duration
                        </label>
                        <input
                          type="number"
                          value={newActivityDuration}
                          onChange={(e) => setNewActivityDuration(e.target.value)}
                          min="1"
                          className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          data-testid="activity-duration-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Unit
                        </label>
                        <select
                          value={newActivityUnit}
                          onChange={(e) => setNewActivityUnit(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          data-testid="activity-unit-select"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="times">Times</option>
                        </select>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleAddActivity}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                      data-testid="save-activity-button"
                    >
                      Save Activity
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Activities List */}
            {streakData.activities.length === 0 ? (
              <div className="text-center py-12">
                <Flame className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No activities yet</p>
                <p className="text-sm text-muted-foreground">
                  Add your first activity to start building your streak!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {streakData.activities.map((activity, index) => {
                  const isCompleted = isActivityCompleted(activity.id)
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCompleted
                          ? "bg-green-50 dark:bg-green-950/30 border-green-500 dark:border-green-600"
                          : "bg-background border-border hover:border-primary/50"
                      }`}
                      data-testid={`activity-item-${activity.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={() => handleToggleActivity(activity.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isCompleted
                              ? "bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600 text-white"
                              : "border-border hover:border-primary"
                          }`}
                          data-testid={`activity-checkbox-${activity.id}`}
                        >
                          {isCompleted && <Check size={18} />}
                        </motion.button>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isCompleted ? "text-green-600 dark:text-green-400 line-through" : "text-foreground"}`}>
                            {activity.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {activity.duration} {activity.durationUnit}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleDeleteActivity(activity.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex-shrink-0 text-destructive hover:text-destructive/80 p-2"
                          data-testid={`delete-activity-${activity.id}`}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl shadow-md p-6 border border-blue-200 dark:border-blue-800"
          >
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Streak Tips
            </h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>🎯 Start with 2-3 activities to build consistency</li>
              <li>⏰ Set activities you can realistically do daily</li>
              <li>🔥 Check in every day to maintain your streak</li>
              <li>📈 Track your progress and celebrate milestones</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
