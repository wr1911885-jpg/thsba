"use client"

import { tournaments, feedPosts } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Fish, MessageCircle, Heart, Package, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming").slice(0, 3)
  const recentPosts = feedPosts.slice(0, 3)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-6 space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-balance">North Texas Division Champions</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Join the Allen High School Bass Fishing Team as we compete across the best lakes in North Texas. Track
              tournaments, share catches, and improve your skills with AI-powered insights.
            </p>
          </section>

          {/* Quick Actions */}
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 text-center">
                <CalendarDays className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Tournaments</h3>
                <p className="text-sm text-muted-foreground mb-4">View upcoming tournaments and results</p>
                <Button size="sm" asChild>
                  <Link href="/tournaments">View All</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 text-center">
                <Package className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Gear Checklist</h3>
                <p className="text-sm text-muted-foreground mb-4">Prepare your tackle and equipment</p>
                <Button size="sm" asChild>
                  <Link href="/gear">Check Gear</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Practice Logs</h3>
                <p className="text-sm text-muted-foreground mb-4">Track your fishing sessions and progress</p>
                <Button size="sm" asChild>
                  <Link href="/practice">View Logs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 text-center">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">AI Tools</h3>
                <p className="text-sm text-muted-foreground mb-4">Get expert fishing advice and planning</p>
                <Button size="sm" asChild>
                  <Link href="/ai-tools">Ask AI</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Tournaments */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Upcoming Tournaments</h3>
              <Button variant="outline" asChild>
                <Link href="/tournaments">View All</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingTournaments.map((tournament) => (
                <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-tight">{tournament.name}</CardTitle>
                      <Badge variant="secondary">{tournament.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(tournament.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {tournament.location}
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/tournaments/${tournament.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Feed Activity */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Recent Activity</h3>
              <Button variant="outline" asChild>
                <Link href="/feed">View Feed</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Fish className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{post.userName}</span>
                          <Badge variant="outline" className="text-xs">
                            {post.type.replace("-", " ")}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm">{post.content}</p>
                        {post.catchDetails && (
                          <div className="bg-accent/20 rounded-lg p-3 text-sm">
                            <div className="font-medium">{post.catchDetails.species}</div>
                            <div className="text-muted-foreground">
                              {post.catchDetails.weight} lbs • {post.catchDetails.length}" • {post.catchDetails.lure}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments.length}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </AuthGuard>
  )
}
