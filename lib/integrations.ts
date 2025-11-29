import { Mail, MessageSquare, Calendar, Users, Video, FileText, Briefcase, Cloud, Database, Bell } from "lucide-react"

export const INTEGRATIONS = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Sync your Gmail inbox and get smart email scheduling suggestions',
    icon: Mail,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    category: 'Email',
    connected: false,
    comingSoon: false
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Connect your Outlook calendar and emails for seamless integration',
    icon: Mail,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    category: 'Email',
    connected: false,
    comingSoon: false
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and manage tasks directly from Slack channels',
    icon: MessageSquare,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    category: 'Communication',
    connected: false,
    comingSoon: false
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Sync your Teams meetings and collaborate with your schedule',
    icon: Users,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    category: 'Communication',
    connected: false,
    comingSoon: false
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Two-way sync with Google Calendar for perfect schedule alignment',
    icon: Calendar,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    category: 'Calendar',
    connected: false,
    comingSoon: false
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Auto-add Zoom links to your time blocks and meetings',
    icon: Video,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    category: 'Video',
    connected: false,
    comingSoon: true
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync your Notion tasks and databases with your time blocks',
    icon: FileText,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-700',
    category: 'Productivity',
    connected: false,
    comingSoon: true
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Schedule LinkedIn posts and track professional networking time',
    icon: Briefcase,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    category: 'Social',
    connected: false,
    comingSoon: true
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Attach files from Dropbox to your time blocks and tasks',
    icon: Cloud,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    category: 'Storage',
    connected: false,
    comingSoon: true
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Import Asana tasks and sync completion status automatically',
    icon: Database,
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    category: 'Project Management',
    connected: false,
    comingSoon: true
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Connect Trello boards and cards to your daily time blocks',
    icon: Database,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    category: 'Project Management',
    connected: false,
    comingSoon: true
  },
  {
    id: 'webex',
    name: 'Cisco Webex',
    description: 'Sync Webex meetings and add conference links automatically',
    icon: Video,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    category: 'Video',
    connected: false,
    comingSoon: true
  }
]

export const INTEGRATION_CATEGORIES = [
  'All',
  'Email',
  'Communication',
  'Calendar',
  'Video',
  'Productivity',
  'Social',
  'Storage',
  'Project Management'
]
