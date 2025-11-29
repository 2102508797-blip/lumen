"use client"

import React, { useState } from "react"

type TimeBlock = {
  id?: string
  title: string
  date: string
  startTime: string
  endTime: string
  description?: string
}

type TimeBlockingModalProps = {
  onClose: () => void
  onAdd: (block: Omit<TimeBlock, "id">) => void
  onUpdate?: (id: string, updates: Omit<TimeBlock, "id">) => void
  initialBlock?: TimeBlock
  presetDate?: string
  presetStartTime?: string
  presetEndTime?: string
}

export default function TimeBlockingModal({
  onClose,
  onAdd,
  onUpdate,
  initialBlock,
  presetDate,
  presetStartTime,
  presetEndTime,
}: TimeBlockingModalProps) {
  // date as yyyy-mm-dd for the <input type="date">
  const getInitialDate = () => {
    if (initialBlock?.date) {
      // If date is already in YYYY-MM-DD format, use it directly
      return initialBlock.date.length === 10 ? initialBlock.date : initialBlock.date.slice(0, 10)
    }
    if (presetDate) {
      return presetDate.length === 10 ? presetDate : presetDate.slice(0, 10)
    }
    // Get current date in YYYY-MM-DD format without timezone conversion
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const initialDateInput = getInitialDate()

  const [title, setTitle] = useState(initialBlock?.title ?? "")
  const [dateInput, setDateInput] = useState(initialDateInput)
  const [startTime, setStartTime] = useState(
    initialBlock?.startTime ?? presetStartTime ?? "09:00",
  )
  const [endTime, setEndTime] = useState(
    initialBlock?.endTime ?? presetEndTime ?? "10:00",
  )
  const [description, setDescription] = useState(initialBlock?.description ?? "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Store date as YYYY-MM-DD string to avoid timezone issues
    const payload: Omit<TimeBlock, "id"> = {
      title,
      date: dateInput,
      startTime,
      endTime,
      description,
    }

    if (initialBlock && initialBlock.id && onUpdate) {
      onUpdate(initialBlock.id, payload)
    } else {
      onAdd(payload)
    }

    onClose()
  }

  const isEditing = Boolean(initialBlock)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-6 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {isEditing ? "Edit Time Block" : "Add Time Block"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Choose a date, select a time range, and describe what you&apos;re
              working on.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm px-2 py-1 rounded-md hover:bg-muted"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Deep work, class, meeting..."
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Start time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                End time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What are you going to work on during this block?"
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:bg-primary/90 transition-colors"
            >
              {isEditing ? "Update Block" : "Add Block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
