export interface Tournament {
  id: string
  name: string
  date: string
  location: string
  lake: string
  status: "upcoming" | "active" | "completed"
  description?: string
  rules?: string
}

export interface FeedPost {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  type: "note" | "catch" | "gear-reminder" | "tournament-update"
  timestamp: string
  tournamentId?: string
  images?: string[]
  likes: number
  comments: Comment[]
  catchDetails?: {
    species: string
    weight: number
    length: number
    lure: string
    location: string
  }
  gearReminder?: {
    items: string[]
    priority: "low" | "medium" | "high"
  }
}

export interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
}

export interface GearItem {
  id: string
  name: string
  category: "rods" | "reels" | "lures" | "tackle" | "electronics" | "safety" | "other"
  isChecked: boolean
  notes?: string
  priority: "essential" | "recommended" | "optional"
}

export interface PracticeLog {
  id: string
  date: string
  lake: string
  duration: number // in minutes
  conditions: {
    weather: string
    temperature: number
    windSpeed: number
    waterTemp?: number
  }
  techniques: string[]
  catches: {
    species: string
    count: number
    avgWeight?: number
    lures: string[]
  }[]
  notes: string
  rating: number // 1-5 stars
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "member" | "captain" | "coach"
  joinDate: string
}
