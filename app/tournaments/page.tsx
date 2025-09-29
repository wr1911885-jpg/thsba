"use client"

import { getUpcomingTournaments } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Fish, Trophy, History } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"

export default function TournamentsPage() {
  const upcomingTournaments = getUpcomingTournaments()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-6 space-y-8">
          {/* Page Header */}
          <section className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Fish className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Tournaments</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compete across the premier bass fishing lakes in North Texas Division
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" asChild>
                <Link href="/tournaments/past">
                  <History className="h-4 w-4 mr-2" />
                  Past Tournaments
                </Link>
              </Button>
            </div>
          </section>

          {/* Upcoming Tournaments */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Upcoming Tournaments</h3>
              <Badge variant="secondary" className="text-sm">
                {upcomingTournaments.length} tournaments
              </Badge>
            </div>

            {upcomingTournaments.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {upcomingTournaments.map((tournament) => (
                  <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl leading-tight">{tournament.name}</CardTitle>
                        <Badge variant="secondary" className="ml-2">
                          {tournament.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{tournament.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(tournament.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{tournament.lake}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" asChild>
                          <Link href={`/tournaments/${tournament.id}`}>View Details</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href={`/tournaments/${tournament.id}/feed`}>Tournament Feed</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Tournaments</h3>
                  <p className="text-muted-foreground">Check back later for new tournament announcements.</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Tournament Schedule */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">2025-2026 Season Schedule</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {upcomingTournaments.map((tournament, index) => (
                    <div
                      key={tournament.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{tournament.name}</div>
                          <div className="text-sm text-muted-foreground">{tournament.lake}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{new Date(tournament.date).toLocaleDateString()}</div>
                        <Badge variant="default" className="text-xs">
                          {tournament.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </AuthGuard>
  )
}
