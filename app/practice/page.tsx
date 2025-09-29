"use client"

import { useState } from "react"
import { practiceLogs } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Fish, ArrowLeft, Plus, Calendar, MapPin, Clock, Thermometer, Star } from "lucide-react"
import Link from "next/link"
import type { PracticeLog } from "@/lib/types"

export default function PracticePage() {
  const [logs, setLogs] = useState<PracticeLog[]>(practiceLogs)
  const [showCreateLog, setShowCreateLog] = useState(false)

  const getAverageRating = () => {
    if (logs.length === 0) return 0
    return logs.reduce((sum, log) => sum + log.rating, 0) / logs.length
  }

  const getTotalHours = () => {
    return logs.reduce((sum, log) => sum + log.duration, 0) / 60 // Convert minutes to hours
  }

  const getTotalCatches = () => {
    return logs.reduce((sum, log) => sum + log.catches.reduce((catchSum, c) => catchSum + c.count, 0), 0)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <Fish className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Practice Logs</h1>
              </div>
            </div>
            <Button onClick={() => setShowCreateLog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Log
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Stats Overview */}
        <section className="mb-8">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{logs.length}</div>
                <div className="text-sm text-muted-foreground">Practice Sessions</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{getTotalHours().toFixed(1)}h</div>
                <div className="text-sm text-muted-foreground">Total Hours</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{getTotalCatches()}</div>
                <div className="text-sm text-muted-foreground">Total Catches</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {renderStars(Math.round(getAverageRating()))}
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Create New Log Modal */}
        {showCreateLog && (
          <section className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Create Practice Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Fish className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Log Creation Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    The practice log creation form will be available in the next update.
                  </p>
                  <Button variant="outline" onClick={() => setShowCreateLog(false)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Practice Logs */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Sessions</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>

          {logs.map((log) => (
            <Card key={log.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Log Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{log.lake}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(log.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {Math.floor(log.duration / 60)}h {log.duration % 60}m
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">{renderStars(log.rating)}</div>
                  </div>

                  {/* Conditions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-medium">Weather</div>
                      <div className="text-xs text-muted-foreground">{log.conditions.weather}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Air Temp</div>
                      <div className="text-xs text-muted-foreground">{log.conditions.temperature}°F</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Wind</div>
                      <div className="text-xs text-muted-foreground">{log.conditions.windSpeed} mph</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Water Temp</div>
                      <div className="text-xs text-muted-foreground">
                        {log.conditions.waterTemp ? `${log.conditions.waterTemp}°F` : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Catches */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Catches</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      {log.catches.map((catchData, index) => (
                        <div key={index} className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{catchData.species}</span>
                            <Badge variant="outline">{catchData.count} fish</Badge>
                          </div>
                          {catchData.avgWeight && (
                            <div className="text-sm text-muted-foreground mb-2">
                              Avg Weight: {catchData.avgWeight} lbs
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {catchData.lures.map((lure, lureIndex) => (
                              <Badge key={lureIndex} variant="secondary" className="text-xs">
                                {lure}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Techniques */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Techniques Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {log.techniques.map((technique, index) => (
                        <Badge key={index} variant="outline">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Notes</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{log.notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/ai-tools">
                    <Fish className="h-4 w-4 mr-2" />
                    Get AI Analysis
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Thermometer className="h-4 w-4 mr-2" />
                  Weather Forecast
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Lake Conditions
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tips */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Practice Log Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Log your sessions immediately after fishing for accurate details</p>
              <p>• Include water temperature when possible - it's crucial for pattern recognition</p>
              <p>• Note specific lure colors and sizes, not just types</p>
              <p>• Record exact locations and depths where you found fish</p>
              <p>• Track weather changes during your session</p>
              <p>• Use your logs to identify patterns before tournaments</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
