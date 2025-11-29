"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import CalendarView from "@/components/dashboard/calendar-view"
import TimeBlockingModal from "@/components/dashboard/time-blocking-modal"
import MotivationalHeader from "@/components/dynamic/motivational-header"
import ProductivityStats from "@/components/dynamic/productivity-stats"
import FloatingTips from "@/components/dynamic/floating-tips"
import CelebrationConfetti from "@/components/dynamic/celebration-confetti"
import { formatTime, getClockFormat } from "@/lib/time-utils"

type TimeBlock = {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  description?: string
}

type DraftRange = {
  date: string
  startTime: string
  endTime: string
}

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([])
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null)
  const [draftRange, setDraftRange] = useState<DraftRange | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [statsKey, setStatsKey] = useState(0)
  const [clockFormat, setClockFormat] = useState<"12h" | "24h">("24h")

  // Load time blocks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("timeBlocks")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setTimeBlocks(parsed)
      } catch (e) {
        console.error("Failed to parse time blocks:", e)
      }
    }
    setClockFormat(getClockFormat())
  }, [])

  // Save time blocks to localStorage whenever they change
  useEffect(() => {
    if (timeBlocks.length > 0) {
      localStorage.setItem("timeBlocks", JSON.stringify(timeBlocks))
    }
  }, [timeBlocks])

  const handleAddBlock = (block: Omit<TimeBlock, "id">) => {
    setTimeBlocks((prev) => [...prev, { ...block, id: Date.now().toString() }])
    setIsModalOpen(false)
    setDraftRange(null)
    setStatsKey(prev => prev + 1)
    
    // Check if this is their 5th, 10th, or 20th block for celebration
    const newTotal = timeBlocks.length + 1
    if (newTotal === 5 || newTotal === 10 || newTotal === 20) {
      setShowCelebration(true)
    }
  }

  const handleDeleteBlock = (id: string) => {
    setTimeBlocks((prev) => prev.filter((block) => block.id !== id))
    setStatsKey(prev => prev + 1)
  }

  const handleUpdateBlock = (id: string, updates: Omit<TimeBlock, "id">) => {
    setTimeBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, ...updates, id } : block)))
    setIsModalOpen(false)
    setEditingBlock(null)
    setDraftRange(null)
    setStatsKey(prev => prev + 1)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const activeDate = selectedDate || new Date()

  const blocksForSelectedDate = timeBlocks.filter((block) => {
    // Handle both YYYY-MM-DD and ISO date formats
    const blockDate = block.date.length === 10 
      ? new Date(block.date + 'T12:00:00') // Add noon time to avoid timezone issues
      : new Date(block.date)
    return isSameDay(blockDate, activeDate)
  })

  const startOfWeek = getStartOfWeek(activeDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i))

  const blocksByDay: Record<string, TimeBlock[]> = {}
  timeBlocks.forEach((block) => {
    // Handle both YYYY-MM-DD and ISO date formats
    const blockDate = block.date.length === 10 
      ? new Date(block.date + 'T12:00:00')
      : new Date(block.date)
    const key = dayKey(blockDate)
    if (!blocksByDay[key]) blocksByDay[key] = []
    blocksByDay[key].push(block)
  })

  const monthlyBlocks = timeBlocks.filter((block) => {
    const blockDate = block.date.length === 10 
      ? new Date(block.date + 'T12:00:00')
      : new Date(block.date)
    return isSameMonth(blockDate, currentDate)
  })

  const handleOpenModal = () => {
    setEditingBlock(null)
    setDraftRange(null)
    setIsModalOpen(true)
  }

  // called when drag on timeline finishes
  const handleTimelineRangeSelect = (startHour: number, endHour: number) => {
    const pad = (n: number) => n.toString().padStart(2, "0")
    // Format as YYYY-MM-DD to avoid timezone issues
    const year = activeDate.getFullYear()
    const month = String(activeDate.getMonth() + 1).padStart(2, '0')
    const day = String(activeDate.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`

    setDraftRange({
      date: dateString,
      startTime: `${pad(startHour)}:00`,
      endTime: `${pad(endHour)}:00`,
    })
    setEditingBlock(null)
    setIsModalOpen(true)
  }

  const openEditBlock = (block: TimeBlock) => {
    setEditingBlock(block)
    setDraftRange(null)
    setIsModalOpen(true)
  }

  return (
    <div className="p-4 lg:p-8 transition-all duration-300">
      {/* Celebration Confetti */}
      <CelebrationConfetti 
        trigger={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
      
      {/* Floating Tips */}
      <FloatingTips />
      
      {/* Motivational Header */}
      <MotivationalHeader />
      
      {/* Productivity Stats */}
      <ProductivityStats key={statsKey} />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Your Calendar</h1>
          <p className="text-muted-foreground">
            Plan your week with smart time blocking and 24-hour control.
          </p>
        </motion.div>
        <motion.button
          onClick={handleOpenModal}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
          data-testid="add-time-block-button"
        >
          <Plus size={20} />
          Add Time Block
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mini Calendar */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-xl shadow-md p-6 border border-border lg:col-span-1 h-fit transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="p-1.5 hover:bg-muted rounded-lg transition">
                <ChevronLeft size={18} />
              </button>
              <button onClick={nextMonth} className="p-1.5 hover:bg-muted rounded-lg transition">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            Busy days appear in red, lighter days in green.
          </p>

          <CalendarView
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            timeBlocks={timeBlocks}
          />
        </motion.div>

        {/* Right side */}
        <div className="lg:col-span-2 space-y-5">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-xl shadow-md p-6 border border-border transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">This Week&apos;s Schedule</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Select a day on the calendar and drag on the timeline to block your time.
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{formatDateLabel(activeDate)}</p>
                <p className="mt-1">
                  {blocksForSelectedDate.length > 0
                    ? `${blocksForSelectedDate.length} block${
                        blocksForSelectedDate.length > 1 ? "s" : ""
                      } for this day`
                    : "No blocks yet for this day"}
                </p>
              </div>
            </div>

            {/* 1. Daily hourly timeline */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Hourly plan for {formatDateLabel(activeDate)}
              </p>
              <DayTimeline
                dayBlocks={blocksForSelectedDate}
                onRangeSelect={handleTimelineRangeSelect}
              />
            </div>

            {/* 2. Tasks for this day (click to edit) */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Tasks for this day
              </p>
              {blocksForSelectedDate.length === 0 ? (
                <div className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-4 text-center">
                  No tasks for this day yet. Drag on the timeline or use &quot;Add Time Block&quot;.
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  {blocksForSelectedDate
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((block) => (
                      <div
                        key={block.id}
                        onClick={() => openEditBlock(block)}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 hover:bg-muted/70 transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-medium text-foreground">{block.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(block.startTime, clockFormat)} – {formatTime(block.endTime, clockFormat)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteBlock(block.id)
                          }}
                          className="text-[11px] text-destructive hover:text-destructive/80 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* 3. This week at a glance */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                This week at a glance
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
                {weekDays.map((day) => {
                  const key = dayKey(day)
                  const blocks = blocksByDay[key] || []
                  const isToday = isSameDay(day, new Date())

                  return (
                    <div
                      key={key}
                      className={`rounded-lg border px-2 py-2 bg-muted/40 hover:bg-muted/80 transition-colors cursor-pointer ${
                        isToday ? "border-secondary" : "border-border"
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[11px] text-foreground">
                          {day.toLocaleDateString(undefined, {
                            weekday: "short",
                          })}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {day.getDate()}
                        </span>
                      </div>
                      {blocks.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground italic">No blocks</p>
                      ) : (
                        <ul className="space-y-0.5">
                          {blocks
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .slice(0, 3)
                            .map((block) => (
                              <li key={block.id} className="text-[10px] text-foreground/80 truncate">
                                {formatTime(block.startTime, clockFormat)} – {formatTime(block.endTime, clockFormat)} · {block.title}
                              </li>
                            ))}
                          {blocks.length > 3 && (
                            <li className="text-[10px] text-muted-foreground">
                              +{blocks.length - 3} more
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 4. Month summary */}
            <div className="border-t border-border pt-3 mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>
                Month overview:{" "}
                <span className="font-medium text-foreground">
                  {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                </span>
              </span>
              <span>
                {monthlyBlocks.length} block{monthlyBlocks.length === 1 ? "" : "s"} scheduled this
                month
              </span>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-accent/20 to-secondary/10 rounded-xl shadow-md p-6 border border-accent/30 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <h3 className="font-bold text-foreground mb-3">Time Blocking Tips</h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>✓ Block 90 minutes for deep work sessions</li>
              <li>✓ Include buffer time between meetings or classes</li>
              <li>✓ Schedule 5–10 minute breaks every 2 hours</li>
              <li>✓ Batch similar tasks together to reduce context switching</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <TimeBlockingModal
          onClose={() => {
            setIsModalOpen(false)
            setEditingBlock(null)
            setDraftRange(null)
          }}
          onAdd={handleAddBlock}
          onUpdate={handleUpdateBlock}
          initialBlock={editingBlock ?? undefined}
          presetDate={draftRange?.date}
          presetStartTime={draftRange?.startTime}
          presetEndTime={draftRange?.endTime}
        />
      )}
    </div>
  )
}

/* ---------- helpers ---------- */

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function getStartOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sun
  const diff = d.getDate() - day
  return new Date(d.getFullYear(), d.getMonth(), diff)
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/* ---------- 24h timeline (busy hours = red) ---------- */

type TimelineBlock = {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  description?: string
}

function DayTimeline({
  dayBlocks,
  onRangeSelect,
}: {
  dayBlocks: TimelineBlock[]
  onRangeSelect: (startHour: number, endHour: number) => void
}) {
  const HOURS = Array.from({ length: 24 }, (_, i) => i)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [dragEnd, setDragEnd] = useState<number | null>(null)

  const parseHour = (time: string | undefined): number | null => {
    if (!time) return null
    const [hStr] = time.split(":")
    const h = Number(hStr)
    if (!Number.isFinite(h) || h < 0 || h > 23) return null
    return h
  }

  // mark busy hours; also handle weird "end < start" (like 09:00 – 00:00)
  const busyHours = new Set<number>()
  dayBlocks.forEach((block) => {
    const startH = parseHour(block.startTime)
    const endHRaw = parseHour(block.endTime)
    if (startH === null) return

    let start = startH
    let end = endHRaw ?? start + 1
    if (end <= start) end = start + 1 // at least 1 hour

    start = Math.max(0, Math.min(23, start))
    end = Math.max(start + 1, Math.min(24, end))

    for (let h = start; h < end; h++) {
      busyHours.add(h)
    }
  })

  const startDrag = (hour: number) => {
    setIsDragging(true)
    setDragStart(hour)
    setDragEnd(hour)
  }

  const updateDrag = (hour: number) => {
    if (!isDragging) return
    setDragEnd(hour)
  }

  const finishDrag = () => {
    if (isDragging && dragStart !== null && dragEnd !== null) {
      const start = Math.min(dragStart, dragEnd)
      const end = Math.max(dragStart, dragEnd)
      // If dragging a single hour, make it a 1-hour block
      if (end === start) {
        onRangeSelect(start, end + 1)
      } else {
        // For multi-hour drag, end hour is inclusive
        onRangeSelect(start, end)
      }
    }
    setIsDragging(false)
    setDragStart(null)
    setDragEnd(null)
  }

  const isInSelection = (hour: number) => {
    if (dragStart === null || dragEnd === null) return false
    const start = Math.min(dragStart, dragEnd)
    const end = Math.max(dragStart, dragEnd)
    return hour >= start && hour <= end
  }

  // mouseup anywhere
  useEffect(() => {
    if (!isDragging) return
    const handleUp = () => finishDrag()
    window.addEventListener("mouseup", handleUp)
    return () => window.removeEventListener("mouseup", handleUp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragStart, dragEnd])

  return (
    <div
      className="rounded-xl border border-border bg-muted/40 p-3 max-h-80 overflow-y-auto transition-all"
      onMouseLeave={finishDrag}
    >
      <div className="grid grid-cols-[60px_1fr] gap-2">
        {/* hour labels */}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {HOURS.map((hour) => (
            <div key={hour} className="h-7 flex items-center justify-end pr-1">
              {hour.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* slots */}
        <div className="flex flex-col gap-1">
          {HOURS.map((hour) => {
            const busy = busyHours.has(hour)
            const selected = isInSelection(hour)

            let classes =
              "h-7 rounded-lg border cursor-pointer transition-all duration-150 select-none"
            if (busy) {
              // busy = reddish
              classes += " bg-destructive/20 border-destructive/60"
            } else {
              classes += " bg-background/80 border-border/60 hover:bg-secondary/20"
            }
            if (selected) {
              classes += " bg-secondary/50 border-secondary shadow-inner"
            }

            return (
              <div
                key={hour}
                onMouseDown={() => startDrag(hour)}
                onMouseEnter={() => updateDrag(hour)}
                className={classes}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
