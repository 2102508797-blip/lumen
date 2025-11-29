"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Archive, Mail, Link2, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import IntegrationCard from "@/components/integrations/integration-card"
import { INTEGRATIONS, INTEGRATION_CATEGORIES } from "@/lib/integrations"

interface InboxItem {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  archived: boolean
  type: "notification" | "reminder" | "message"
}

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [itemType, setItemType] = useState<"notification" | "reminder" | "message">("notification")
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all")
  const [activeTab, setActiveTab] = useState<"inbox" | "integrations">("inbox")
  const [categoryFilter, setCategoryFilter] = useState("All")

  useEffect(() => {
    const stored = localStorage.getItem("inbox")
    if (stored) {
      setItems(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("inbox", JSON.stringify(items))
  }, [items])

  const handleAddItem = () => {
    if (!newTitle.trim() || !newMessage.trim()) {
      toast.error("Please fill in all fields")
      return
    }
    const item: InboxItem = {
      id: Date.now().toString(),
      title: newTitle,
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      archived: false,
      type: itemType,
    }
    setItems([item, ...items])
    setNewTitle("")
    setNewMessage("")
    toast.success("✅ Item added to inbox!")
  }

  const handleMarkAsRead = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  const handleArchive = (id: string) => {
    const item = items.find(i => i.id === id)
    setItems(items.map((item) => (item.id === id ? { ...item, archived: !item.archived } : item)))
    toast.success(item?.archived ? "📥 Unarchived" : "📦 Archived")
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    toast.success("🗑️ Deleted")
  }

  const handleConnectIntegration = (name: string) => {
    toast.success(`🔗 ${name} integration coming soon!`, { duration: 3000 })
  }

  const filteredItems = items.filter((item) => {
    if (filter === "unread") return !item.read && !item.archived
    if (filter === "archived") return item.archived
    return !item.archived
  })

  const filteredIntegrations = INTEGRATIONS.filter(integration => 
    categoryFilter === "All" || integration.category === categoryFilter
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "notification":
        return "bg-blue-100/50 text-blue-700 border-blue-200"
      case "reminder":
        return "bg-purple-100/50 text-purple-700 border-purple-200"
      case "message":
        return "bg-green-100/50 text-green-700 border-green-200"
      default:
        return ""
    }
  }

  const stats = {
    total: items.length,
    unread: items.filter((i) => !i.read && !i.archived).length,
    archived: items.filter((i) => i.archived).length,
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header with animated gradient */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Mail className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Inbox & Integrations</h1>
        </div>
        <p className="text-muted-foreground">Manage notifications and connect your favorite apps</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 mb-6 bg-muted p-1 rounded-lg w-fit"
      >
        <button
          onClick={() => setActiveTab("inbox")}
          className={`px-6 py-2.5 rounded-md font-medium transition-all flex items-center gap-2 ${
            activeTab === "inbox"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail size={18} />
          <span>Inbox</span>
          {stats.unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full"
            >
              {stats.unread}
            </motion.span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("integrations")}
          className={`px-6 py-2.5 rounded-md font-medium transition-all flex items-center gap-2 ${
            activeTab === "integrations"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Link2 size={18} />
          <span>Integrations</span>
        </button>
      </motion.div>

      {activeTab === "inbox" ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total", value: stats.total, icon: Mail, color: "text-blue-600" },
              { label: "Unread", value: stats.unread, icon: Sparkles, color: "text-secondary" },
              { label: "Archived", value: stats.archived, icon: Archive, color: "text-accent-foreground" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-card rounded-xl p-4 border border-border shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={18} className={stat.color} />
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <motion.p 
                  key={stat.value}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-foreground"
                >
                  {stat.value}
                </motion.p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Item Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-xl shadow-md p-6 border border-border lg:col-span-1 h-fit"
            >
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Plus size={20} />
                New Item
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Item title"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message details"
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value as any)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="notification">Notification</option>
                    <option value="reminder">Reminder</option>
                    <option value="message">Message</option>
                  </select>
                </div>
                <motion.button
                  onClick={handleAddItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus size={20} />
                  Add Item
                </motion.button>
              </div>
            </motion.div>

            {/* Items List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-4"
            >
              {/* Filter Buttons */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {["all", "unread", "archived"].map((f) => (
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

              {/* Items */}
              <AnimatePresence mode="popLayout">
                {filteredItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-16 bg-card rounded-xl border border-border"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                    </motion.div>
                    <p className="text-muted-foreground text-lg">No items in this view</p>
                    <p className="text-sm text-muted-foreground mt-2">Create one to get started!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        className={`p-5 rounded-xl border transition-all cursor-pointer ${
                          item.read
                            ? "bg-muted/30 border-border/50"
                            : "bg-card border-secondary/50 hover:border-secondary shadow-md"
                        }`}
                        onClick={() => handleMarkAsRead(item.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className={`font-bold text-lg ${
                                item.read ? "text-muted-foreground" : "text-foreground"
                              }`}>
                                {item.title}
                              </h3>
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                                getTypeColor(item.type)
                              }`}>
                                {item.type}
                              </span>
                              {!item.read && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2.5 h-2.5 bg-secondary rounded-full ml-auto"
                                />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                              {item.message}
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleArchive(item.id)
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2.5 hover:bg-muted rounded-lg transition-colors"
                              title={item.archived ? "Unarchive" : "Archive"}
                            >
                              <Archive size={18} className="text-muted-foreground hover:text-foreground" />
                            </motion.button>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(item.id)
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2.5 hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} className="text-destructive" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Integration Categories */}
          <div className="flex gap-2 flex-wrap">
            {INTEGRATION_CATEGORIES.map((category) => (
              <motion.button
                key={category}
                onClick={() => setCategoryFilter(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  categoryFilter === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Integration Cards Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="show"
          >
            {filteredIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <IntegrationCard
                  name={integration.name}
                  description={integration.description}
                  icon={integration.icon}
                  iconBg={integration.iconBg}
                  iconColor={integration.iconColor}
                  connected={integration.connected}
                  comingSoon={integration.comingSoon}
                  onConnect={() => handleConnectIntegration(integration.name)}
                />
              </motion.div>
            ))}
          </motion.div>

          {filteredIntegrations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-card rounded-xl border border-border"
            >
              <Link2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-lg">No integrations found</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
