// Simple authentication context and utilities
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "member" | "captain" | "coach"
  joinDate: string
}

export const mockUsers: User[] = []

// Simple auth functions (replace with real auth later)
export function authenticateUser(email: string, password: string): User | null {
  const user = mockUsers.find((u) => u.email === email)
  return user || null
}

export function createUserByCoach(
  name: string,
  email: string,
  password: string,
  role: "member" | "captain" | "coach",
  coachId: string,
): User {
  // Verify the coach exists and has coach role
  const coach = mockUsers.find((u) => u.id === coachId && u.role === "coach")
  if (!coach) {
    throw new Error("Only coaches can create users")
  }

  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    avatar: "/placeholder.svg?height=40&width=40",
    role,
    joinDate: new Date().toISOString().split("T")[0],
  }
  mockUsers.push(newUser)
  return newUser
}

export function getAllUsers(): User[] {
  return mockUsers
}

export function deleteUserByCoach(userId: string, coachId: string): boolean {
  const coach = mockUsers.find((u) => u.id === coachId && u.role === "coach")
  if (!coach) {
    throw new Error("Only coaches can delete users")
  }

  const index = mockUsers.findIndex((u) => u.id === userId)
  if (index !== -1) {
    mockUsers.splice(index, 1)
    return true
  }
  return false
}
