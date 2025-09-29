import type { Tournament, FeedPost, GearItem, PracticeLog } from "./types"

// North Texas Division Tournaments (hardcoded as requested)
export const tournaments: Tournament[] = [
  {
    id: "1",
    name: "Ray Roberts Tournament",
    date: "2025-09-13",
    location: "Ray Roberts Lake, TX",
    lake: "Ray Roberts",
    status: "upcoming",
    description: "Season opener at Ray Roberts Lake. Known for excellent bass fishing and scenic views.",
  },
  {
    id: "2",
    name: "Lewisville Tournament",
    date: "2025-10-04",
    location: "Lewisville Lake, TX",
    lake: "Lewisville",
    status: "upcoming",
    description: "Technical fishing on a pressured lake. Strategy and finesse will be key.",
  },
  {
    id: "3",
    name: "Tawakoni Tournament",
    date: "2025-10-25",
    location: "Lake Tawakoni, TX",
    lake: "Tawakoni",
    status: "upcoming",
    description: "Large lake with diverse structure and excellent bass population.",
  },
  {
    id: "4",
    name: "Cedar Creek Tournament",
    date: "2026-02-28",
    location: "Cedar Creek Lake, TX",
    lake: "Cedar Creek",
    status: "upcoming",
    description: "Deep water structure fishing with potential for big bags.",
  },
  {
    id: "5",
    name: "Ray Roberts Championship",
    date: "2026-03-21",
    location: "Ray Roberts Lake, TX",
    lake: "Ray Roberts",
    status: "upcoming",
    description: "Season championship back at Ray Roberts Lake. The culmination of the tournament season.",
  },
]

export const pastTournaments: Tournament[] = [
  {
    id: "past-1",
    name: "Lake Fork Championship 2024",
    date: "2024-03-15",
    location: "Lake Fork, TX",
    lake: "Lake Fork",
    status: "completed",
    description: "2024 season championship with record-breaking catches.",
  },
  {
    id: "past-2",
    name: "Texoma Spring Classic 2024",
    date: "2024-02-20",
    location: "Lake Texoma, TX",
    lake: "Texoma",
    status: "completed",
    description: "Early season tournament with challenging conditions.",
  },
  {
    id: "past-3",
    name: "Ray Roberts Fall Tournament 2023",
    date: "2023-10-28",
    location: "Ray Roberts Lake, TX",
    lake: "Ray Roberts",
    status: "completed",
    description: "Fall tournament with excellent topwater action.",
  },
]

export function getUpcomingTournaments(): Tournament[] {
  const now = new Date()
  return tournaments.filter((tournament) => {
    const tournamentDate = new Date(tournament.date)
    return tournamentDate >= now
  })
}

export function getPastTournaments(): Tournament[] {
  const now = new Date()
  const recentPast = tournaments.filter((tournament) => {
    const tournamentDate = new Date(tournament.date)
    return tournamentDate < now
  })
  return [...recentPast, ...pastTournaments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllTournaments(): Tournament[] {
  return [...tournaments, ...pastTournaments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const feedPosts: FeedPost[] = []

export const defaultGearItems: GearItem[] = []

export const practiceLogs: PracticeLog[] = []
