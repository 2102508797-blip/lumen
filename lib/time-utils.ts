export function formatTime(time: string, format: "12h" | "24h" = "24h"): string {
  if (format === "24h") {
    return time
  }

  // Convert 24h to 12h format
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  
  if (hour === 0) {
    return `12:${minutes} AM`
  } else if (hour < 12) {
    return `${hour}:${minutes} AM`
  } else if (hour === 12) {
    return `12:${minutes} PM`
  } else {
    return `${hour - 12}:${minutes} PM`
  }
}

export function getClockFormat(): "12h" | "24h" {
  if (typeof window === 'undefined') return "24h"
  
  const settings = localStorage.getItem("appSettings")
  if (settings) {
    try {
      const parsed = JSON.parse(settings)
      return parsed.clockFormat || "24h"
    } catch (e) {
      return "24h"
    }
  }
  return "24h"
}
