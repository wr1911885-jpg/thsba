"use client"

import { getPastTournaments } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Fish, ArrowLeft, Trophy } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"

export default function PastTournamentsPage() {
  const pastTournaments = getPastTournaments()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container mx-auto px-4 py-6 space-y-8">
          {/* Header */}
          <section className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tournaments">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Tournaments
                </Link>
              </Button>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Past Tournaments</h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Review results and memories from previous Allen THSBA tournaments and championships.
              </p>
            </div>
          </section>

          {/* Past Tournaments Grid */}
          <section className="space-y-6">
            {pastTournaments.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastTournaments.map((tournament) => (
                  <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg leading-tight">{tournament.name}</CardTitle>
                        <Badge variant="outline" className="bg-muted">
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(tournament.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {tournament.location}
                        </div>
                      </div>

                      {tournament.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{tournament.description}</p>
                      )}

                      <div className="pt-2 border-t border-border">
                        <Button variant="outline" className="w-full bg-transparent" asChild>
                          <Link href={`/tournaments/${tournament.id}`}>
                            <Fish className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
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
                  <h3 className="text-lg font-medium mb-2">No Past Tournaments</h3>
                  <p className="text-muted-foreground">
                    Past tournament results will appear here after tournaments are completed.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Tournament History Stats */}
          {pastTournaments.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-center">Tournament History</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">{pastTournaments.length}</div>
                    <div className="text-sm text-muted-foreground">Tournaments Completed</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {pastTournaments.filter((t) => t.name.toLowerCase().includes("championship")).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Championships</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {new Set(pastTournaments.map((t) => t.lake)).size}
                    </div>
                    <div className="text-sm text-muted-foreground">Different Lakes</div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
