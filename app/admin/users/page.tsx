"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { createUserByCoach, getAllUsers, deleteUserByCoach } from "@/lib/auth"
import { UserPlus, Trash2, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserManagementPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState(getAllUsers())
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "member" as "member" | "captain" | "coach",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Redirect if not a coach
  if (!user || user.role !== "coach") {
    router.push("/")
    return null
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        setError("All fields are required")
        return
      }

      createUserByCoach(newUser.name, newUser.email, newUser.password, newUser.role, user.id)
      setUsers(getAllUsers())
      setSuccess(`User ${newUser.name} added successfully!`)
      setNewUser({ name: "", email: "", password: "", role: "member" })
      setIsAddingUser(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user")
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      deleteUserByCoach(userId, user.id)
      setUsers(getAllUsers())
      setSuccess("User deleted successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Add and manage team members</p>
          </div>
          <Button onClick={() => setIsAddingUser(!isAddingUser)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>}

        {success && <div className="bg-green-500/10 text-green-600 p-4 rounded-md">{success}</div>}

        {isAddingUser && (
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@allenhighschool.edu"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: "member" | "captain" | "coach") => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="captain">Captain</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add User</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingUser(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users yet. Add your first team member to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{u.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-sm text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">
                        {u.role}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
