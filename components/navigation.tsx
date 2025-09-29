"use client"

import { Button } from "@/components/ui/button"
import { Fish, LogOut, User, UserPlus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Fish className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Allen THSBA</h1>
              <p className="text-sm text-muted-foreground">Fishing Team</p>
            </div>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/tournaments">Tournaments</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/feed">Feed</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/gear">Gear</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/practice">Practice</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/ai-tools">AI Tools</Link>
                </Button>
                {user.role === "coach" && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/users">Manage Users</Link>
                  </Button>
                )}
              </nav>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </div>
                  </DropdownMenuItem>
                  {user.role === "coach" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/users" className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          Manage Users
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
