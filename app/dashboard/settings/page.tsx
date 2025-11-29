"use client"

import { useState, useEffect } from "react"
import { Save, Settings as SettingsIcon, Bell, Clock, Shield } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

interface Settings {
  theme: "light" | "dark"
  notifications: boolean
  emailReminders: boolean
  soundEnabled: boolean
  defaultBlockDuration: string
  autoBreaks: boolean
  breakDuration: string
  clockFormat: "12h" | "24h"
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    notifications: true,
    emailReminders: true,
    soundEnabled: true,
    defaultBlockDuration: "90",
    autoBreaks: true,
    breakDuration: "15",
    clockFormat: "24h",
  })
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("appSettings")
    if (stored) {
      setSettings(JSON.parse(stored))
    }
  }, [])

  const handleSaveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings))
    setIsSaved(true)
    toast.success("✅ Settings saved successfully!")
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const settingsSections = [
    {
      title: "Notifications",
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-50",
      settings: [
        {
          key: "notifications" as keyof Settings,
          label: "Push Notifications",
          description: "Receive push notifications for reminders",
          type: "toggle"
        },
        {
          key: "emailReminders" as keyof Settings,
          label: "Email Reminders",
          description: "Get email reminders for upcoming blocks",
          type: "toggle"
        },
        {
          key: "soundEnabled" as keyof Settings,
          label: "Sound Effects",
          description: "Play sound for notifications",
          type: "toggle"
        }
      ]
    },
    {
      title: "Time Blocking",
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
      settings: [
        {
          key: "defaultBlockDuration" as keyof Settings,
          label: "Default Block Duration (minutes)",
          description: "Set the default duration for new time blocks",
          type: "number",
          min: 30,
          max: 240,
          step: 15
        },
        {
          key: "autoBreaks" as keyof Settings,
          label: "Auto Breaks",
          description: "Automatically schedule breaks between blocks",
          type: "toggle"
        },
        {
          key: "breakDuration" as keyof Settings,
          label: "Break Duration (minutes)",
          description: "Length of automatic breaks",
          type: "number",
          min: 5,
          max: 60,
          step: 5,
          conditional: "autoBreaks"
        }
      ]
    }
  ]

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
            animate={{ rotate: [0, 180, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
          >
            <SettingsIcon className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground">Customize your Luman experience</p>
      </motion.div>

      <div className="max-w-4xl space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-card rounded-xl shadow-lg p-6 lg:p-8 border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`${section.bg} p-3 rounded-xl`}>
                <section.icon className={`w-6 h-6 ${section.color}`} />
              </div>
              <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
            </div>

            <div className="space-y-5">
              {section.settings.map((setting) => {
                // Skip conditional settings if condition not met
                if (setting.conditional && !settings[setting.conditional as keyof Settings]) {
                  return null
                }

                return (
                  <motion.div
                    key={setting.key}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50 transition-all"
                  >
                    {setting.type === "toggle" && (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-1">{setting.label}</p>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={settings[setting.key] as boolean}
                            onChange={(e) => handleChange(setting.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                        </label>
                      </div>
                    )}

                    {setting.type === "number" && (
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          {setting.label}
                        </label>
                        <p className="text-sm text-muted-foreground mb-3">{setting.description}</p>
                        <input
                          type="number"
                          value={settings[setting.key] as string}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          min={setting.min}
                          max={setting.max}
                          step={setting.step}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-lg font-semibold"
                        />
                      </div>
                    )}

                    {setting.type === "radio" && (
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          {setting.label}
                        </label>
                        <p className="text-sm text-muted-foreground mb-3">{setting.description}</p>
                        <div className="flex gap-4">
                          {setting.options?.map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={setting.key}
                                value={option}
                                checked={settings[setting.key] === option}
                                onChange={(e) => handleChange(setting.key, e.target.value)}
                                className="w-5 h-5 text-primary focus:ring-primary focus:ring-2"
                              />
                              <span className="text-foreground capitalize font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}

        {/* Privacy & Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 lg:p-8 border border-green-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Privacy & Security</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your data is stored locally on your device. We don't collect or store any personal information on external servers. All your time blocks, tasks, and preferences stay private and secure.
          </p>
        </motion.div>

        {/* Save Button */}
        <div className="flex gap-3">
          <motion.button
            onClick={handleSaveSettings}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl text-lg"
          >
            <Save size={24} />
            Save All Settings
          </motion.button>
        </div>

        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center px-6 py-4 bg-green-100 text-green-700 rounded-xl font-medium shadow-md border border-green-200"
          >
            ✅ All settings saved successfully!
          </motion.div>
        )}
      </div>
    </div>
  )
}
