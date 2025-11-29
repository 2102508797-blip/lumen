"use client"

import React from "react"

type TimeBlock = {
  date: string
  startTime: string
  endTime: string
}

type CalendarViewProps = {
  currentDate: Date
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  timeBlocks: TimeBlock[]
}

export default function CalendarView({
  currentDate,
  selectedDate,
  onSelectDate,
  timeBlocks,
}: CalendarViewProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const firstWeekday = firstDayOfMonth.getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = []

  // leading empty cells (previous month)
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null)
  }

  // current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d))
  }

  const today = new Date()

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 text-xs font-medium text-muted-foreground mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="flex items-center justify-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-sm">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={idx} className="h-10" />
          }

          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isToday = isSameDay(day, today)
          const load = getDayLoad(day, timeBlocks)

          let base =
            "h-10 flex items-center justify-center rounded-lg border text-sm transition-colors cursor-pointer"

          let loadClasses = "bg-muted border-border text-foreground"
          if (load === "busy") {
            loadClasses = "bg-destructive/20 border-destructive/60 text-destructive-foreground"
          } else if (load === "easy") {
            loadClasses = "bg-emerald-50 border-emerald-300 text-emerald-700"
          }

          if (isToday) {
            loadClasses += " ring-1 ring-secondary"
          }
          if (isSelected) {
            loadClasses += " ring-2 ring-secondary ring-offset-2 ring-offset-card"
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(day)}
              className={`${base} ${loadClasses}`}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---- helpers ---- */

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getDayLoad(date: Date, timeBlocks: TimeBlock[]) {
  const key = date.toISOString().slice(0, 10)

  let totalMinutes = 0

  const parseToMinutes = (t: string | undefined) => {
    if (!t) return 0
    const [hStr, mStr] = t.split(":")
    const h = Number(hStr)
    const m = Number(mStr)
    if (!Number.isFinite(h) || !Number.isFinite(m)) return 0
    return h * 60 + m
  }

  timeBlocks.forEach((block) => {
    const dKey = new Date(block.date).toISOString().slice(0, 10)
    if (dKey !== key) return

    let start = parseToMinutes(block.startTime)
    let end = parseToMinutes(block.endTime)

    if (end <= start) end = start + 60 // at least 1h

    totalMinutes += end - start
  })

  if (totalMinutes >= 6 * 60) return "busy" // >= 6 hours
  if (totalMinutes > 0) return "easy"
  return "none"
}
