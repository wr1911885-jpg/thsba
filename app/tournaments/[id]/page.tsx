"use client"

import { tournaments, feedPosts } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Fish, MessageCircle, Clock, Waves } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"

interface TournamentPageProps {
  params: {
    id: string
  }
}

export default function TournamentPage({ params }: TournamentPageProps) {
  const tournament = tournaments.find((t) => t.id === params.id)

  if (!tournament) {
    notFound()
  }

  // Get tournament-specific posts
  const tournamentPosts = feedPosts.filter((post) => post.tournamentId === tournament.id)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-6 space-y-8">
          {/* Tournament Hero */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-balance">{tournament.name}</h2>
              <p className="text-lg text-muted-foreground">{tournament.description}</p>
              <Badge variant={tournament.status === "upcoming" ? "default" : "secondary"} className="text-sm">
                {tournament.status}
              </Badge>
            </div>

            {/* Tournament Details Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6 text-center">
                  <CalendarDays className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-medium">Date</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(tournament.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">{tournament.location}</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tournament Actions */}
          <section className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={`/tournaments/${tournament.id}/feed`}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Tournament Feed
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={`/tournaments/${tournament.id}/ai-planner`}>
                <Waves className="h-4 w-4 mr-2" />
                AI Tournament Planner
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/gear">
                <Clock className="h-4 w-4 mr-2" />
                Gear Checklist
              </Link>
            </Button>
          </section>

          {/* Tournament Rules & Info */}
          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Safe boating practices required at all times</p>
                <p>• 5 fish limit, 14" minimum length</p>
                <p>• Live release required - no culling allowed</p>
                <p>• Weigh-in starts at 3:00 PM sharp</p>
                <p>• Late arrivals will be disqualified</p>
                <p>• All team members must participate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lake Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Lake:</strong> {tournament.lake}
                </p>
                <p>
                  <strong>Size:</strong> Varies by location
                </p>
                <p>
                  <strong>Primary Species:</strong> Largemouth Bass, Spotted Bass
                </p>
                <p>
                  <strong>Structure:</strong> Points, creek channels, timber
                </p>
                <p>
                  <strong>Best Techniques:</strong> Varies by season and conditions
                </p>
                <p>
                  <strong>Boat Ramps:</strong> Multiple locations available
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Recent Tournament Activity */}
          {tournamentPosts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Tournament Activity</h3>
                <Button variant="outline" asChild>
                  <Link href={`/tournaments/${tournament.id}/feed`}>View All Posts</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {tournamentPosts.slice(0, 3).map((post) => (
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
                          </div>
                          <p className="text-sm">{post.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
