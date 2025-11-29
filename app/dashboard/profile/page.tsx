"use client"

import { useState, useEffect } from "react"
import { User, Mail, LogOut, Edit2, Camera, Award, Calendar as CalendarIcon, Phone, Briefcase, Heart, Building, Hash, Palette } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import ThemeToggleSimple from "@/components/theme/theme-toggle-simple"

interface UserData {
  id: string
  email: string
  name: string
  createdAt: string
  
  // New comprehensive fields
  phone?: string
  age?: string
  organization?: string
  useCase?: "personal" | "professional" | "both"
  interests?: string[]
  jobTitle?: string
  department?: string
  location?: string
  
  // Existing fields
  bio?: string
  timezone?: string
  workStartTime?: string
  workEndTime?: string
}

const INTERESTS_OPTIONS = [
  "Productivity",
  "Time Management",
  "Goal Setting",
  "Habit Building",
  "Project Management",
  "Team Collaboration",
  "Personal Development",
  "Work-Life Balance",
  "Mindfulness",
  "Health & Fitness",
  "Learning & Education",
  "Creative Work",
  "Business Strategy",
  "Technology",
  "Remote Work"
]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [age, setAge] = useState("")
  const [organization, setOrganization] = useState("")
  const [useCase, setUseCase] = useState<"personal" | "professional" | "both">("personal")
  const [jobTitle, setJobTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [location, setLocation] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [bio, setBio] = useState("")
  const [timezone, setTimezone] = useState("UTC")
  const [workStartTime, setWorkStartTime] = useState("09:00")
  const [workEndTime, setWorkEndTime] = useState("17:00")

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
      
      // Set all fields
      setName(parsed.name || "")
      setEmail(parsed.email || "")
      setPhone(parsed.phone || "")
      setAge(parsed.age || "")
      setOrganization(parsed.organization || "")
      setUseCase(parsed.useCase || "personal")
      setJobTitle(parsed.jobTitle || "")
      setDepartment(parsed.department || "")
      setLocation(parsed.location || "")
      setInterests(parsed.interests || [])
      setBio(parsed.bio || "")
      setTimezone(parsed.timezone || "UTC")
      setWorkStartTime(parsed.workStartTime || "09:00")
      setWorkEndTime(parsed.workEndTime || "17:00")
    }
  }, [])

  const handleSaveProfile = () => {
    if (user) {
      const updated: UserData = {
        ...user,
        name,
        email,
        phone,
        age,
        organization,
        useCase,
        jobTitle,
        department,
        location,
        interests,
        bio,
        timezone,
        workStartTime,
        workEndTime,
      }
      localStorage.setItem("currentUser", JSON.stringify(updated))
      setUser(updated)
      setIsEditing(false)
      toast.success("✅ Profile updated successfully!")
    }
  }

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    toast.success("👋 See you soon!")
    setTimeout(() => router.push("/"), 500)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const memberDays = Math.floor(
    (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  const profileCompleteness = () => {
    const fields = [name, email, phone, age, organization, jobTitle, bio, location]
    const filled = fields.filter(f => f && f.trim()).length
    const total = fields.length + (interests.length > 0 ? 1 : 0)
    return Math.round((filled / total) * 100)
  }

  const completeness = profileCompleteness()

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
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <User className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
        </div>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      <div className="max-w-6xl space-y-6">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl shadow-xl p-8 border border-border"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl relative"
              >
                <User className="w-16 h-16 text-primary-foreground" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-2 right-2 bg-background p-2 rounded-full shadow-lg border border-border"
                >
                  <Camera size={16} />
                </motion.button>
              </motion.div>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-2">{name || user.name}</h2>
              <div className="flex flex-col lg:flex-row items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>{email || user.email}</span>
                </div>
                {phone && (
                  <>
                    <div className="hidden lg:block w-1 h-1 rounded-full bg-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <Phone size={18} />
                      <span>{phone}</span>
                    </div>
                  </>
                )}
                <div className="hidden lg:block w-1 h-1 rounded-full bg-muted-foreground" />
                <div className="flex items-center gap-2">
                  <Award size={18} />
                  <span>Member for {memberDays} days</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                  ⭐ Pro Member
                </span>
                <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
                  ✅ Verified
                </span>
                {useCase && (
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800 capitalize">
                    📊 {useCase} Use
                  </span>
                )}
              </div>
              
              {/* Profile Completeness */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completeness</span>
                  <span className="text-sm font-bold text-primary">{completeness}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completeness}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-card rounded-xl shadow-lg p-8 border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit2 size={20} />
                Personal Information
              </h3>
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-lg font-medium transition-all shadow-sm ${
                  isEditing
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                ) : (
                  <p className="px-4 py-3 rounded-lg bg-muted/30">{name || "Not set"}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address *</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                ) : (
                  <p className="px-4 py-3 rounded-lg bg-muted/30">{email || "Not set"}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                ) : (
                  <p className="px-4 py-3 rounded-lg bg-muted/30">{phone || "Not set"}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold mb-2">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    min="13"
                    max="120"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                ) : (
                  <p className="px-4 py-3 rounded-lg bg-muted/30">{age || "Not set"}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="New York, USA"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                ) : (
                  <p className="px-4 py-3 rounded-lg bg-muted/30">{location || "Not set"}</p>
                )}
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-semibold mb-2">Timezone</label>
                {isEditing ? (
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST (Eastern)</option>
                    <option value="CST">CST (Central)</option>
                    <option value="MST">MST (Mountain)</option>
                    <option value="PST">PST (Pacific)</option>
                    <option value="IST">IST (India)</option>
                    <option value="GMT">GMT (London)</option>
                    <option value="CET">CET (Central Europe)</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 rounded-lg bg-muted/30">{timezone}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-5">
              <label className="block text-sm font-semibold mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all"
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-muted/30 min-h-[100px]">
                  {bio || "No bio added yet"}
                </p>
              )}
            </div>
          </motion.div>

          {/* Professional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Use Case */}
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Briefcase size={18} />
                Use Case
              </h3>
              {isEditing ? (
                <div className="space-y-2">
                  {(["personal", "professional", "both"] as const).map(option => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <input
                        type="radio"
                        name="useCase"
                        value={option}
                        checked={useCase === option}
                        onChange={(e) => setUseCase(e.target.value as any)}
                        className="w-5 h-5 text-primary focus:ring-primary focus:ring-2"
                      />
                      <span className="font-medium capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-3 rounded-lg bg-muted/30 capitalize font-medium">
                  {useCase}
                </p>
              )}
            </div>

            {/* Organization */}
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Building size={18} />
                Organization
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Company Name"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-muted/30">{organization || "Not set"}</p>
              )}
            </div>

            {/* Job Title */}
            {useCase !== "personal" && (
              <>
                <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
                  <h3 className="text-lg font-bold mb-4">Job Title</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Product Manager"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  ) : (
                    <p className="px-4 py-3 rounded-lg bg-muted/30">{jobTitle || "Not set"}</p>
                  )}
                </div>

                <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
                  <h3 className="text-lg font-bold mb-4">Department</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Engineering"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  ) : (
                    <p className="px-4 py-3 rounded-lg bg-muted/30">{department || "Not set"}</p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Interests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl shadow-lg p-8 border border-border"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart size={20} />
            Interests & Focus Areas
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
          
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {INTERESTS_OPTIONS.map(interest => (
                <motion.button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full font-medium transition-all border-2 ${
                    interests.includes(interest)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {interest}
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {interests.length > 0 ? (
                interests.map(interest => (
                  <span
                    key={interest}
                    className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-muted-foreground italic">No interests selected yet</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Work Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl shadow-lg p-8 border border-border"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CalendarIcon size={20} />
            Work Hours Preference
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Work Start Time</label>
              {isEditing ? (
                <input
                  type="time"
                  value={workStartTime}
                  onChange={(e) => setWorkStartTime(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-muted/30 font-mono text-lg">{workStartTime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Work End Time</label>
              {isEditing ? (
                <input
                  type="time"
                  value={workEndTime}
                  onChange={(e) => setWorkEndTime(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              ) : (
                <p className="px-4 py-3 rounded-lg bg-muted/30 font-mono text-lg">{workEndTime}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card rounded-xl shadow-lg p-8 border border-border"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Palette size={20} />
            Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground mb-1">Theme</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <ThemeToggleSimple />
          </div>
        </motion.div>

        {/* Save Button */}
        <AnimatePresence>
          {isEditing && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleSaveProfile}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-xl font-semibold transition-colors shadow-lg text-lg"
            >
              💾 Save All Changes
            </motion.button>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl shadow-lg p-8 border border-border"
        >
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              onClick={() => router.push("/dashboard/settings")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-xl font-medium transition-colors shadow-md"
              data-testid="settings-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              App Settings
            </motion.button>
            
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 py-4 rounded-xl font-medium transition-colors shadow-md"
              data-testid="logout-button"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
