"use client"

import { useState } from "react"
import { tournaments } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Fish, ArrowLeft, Sparkles, MapPin, Calendar, Thermometer, Wind, Loader2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface TournamentAIPlannerProps {
  params: {
    id: string
  }
}

export default function TournamentAIPlannerPage({ params }: TournamentAIPlannerProps) {
  const tournament = tournaments.find((t) => t.id === params.id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [plan, setPlan] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")

  if (!tournament) {
    notFound()
  }

  const generatePlan = async (promptType: string) => {
    setIsGenerating(true)
    setPlan("")

    try {
      let prompt = ""

      switch (promptType) {
        case "strategy":
          prompt = `Create a comprehensive fishing strategy for the ${tournament.name} tournament at ${tournament.lake} on ${new Date(tournament.date).toLocaleDateString()}. Include:
          - Best fishing locations and structure to target
          - Recommended lures and techniques for this time of year
          - Weather considerations and backup plans
          - Time management strategy for tournament day
          - Pre-fishing recommendations`
          break
        case "gear":
          prompt = `Generate a detailed gear checklist for the ${tournament.name} tournament at ${tournament.lake}. Consider:
          - Lake-specific tackle recommendations
          - Backup equipment needs
          - Weather-appropriate gear
          - Tournament-specific requirements
          - Safety equipment priorities`
          break
        case "conditions":
          prompt = `Analyze the expected conditions for ${tournament.name} at ${tournament.lake} on ${new Date(tournament.date).toLocaleDateString()}. Provide:
          - Seasonal bass behavior patterns
          - Water temperature expectations
          - Weather impact on fishing
          - Best times of day to fish
          - Adjustment strategies for changing conditions`
          break
        case "custom":
          prompt = `For the ${tournament.name} tournament at ${tournament.lake}: ${customPrompt}`
          break
      }

      const response = await fetch("/api/ai-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate plan")
      }

      const data = await response.json()
      setPlan(data.plan)
    } catch (error) {
      console.error("Error generating plan:", error)
      setPlan("Sorry, I couldn't generate a plan right now. Please try again later.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/tournaments/${tournament.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold">AI Tournament Planner</h1>
                <p className="text-sm text-muted-foreground">{tournament.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Tournament Info */}
        <section className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <div className="font-medium">Date</div>
                    <div className="text-muted-foreground">{new Date(tournament.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <div className="font-medium">Lake</div>
                    <div className="text-muted-foreground">{tournament.lake}</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Thermometer className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <div className="font-medium">Season</div>
                    <div className="text-muted-foreground">
                      {new Date(tournament.date).toLocaleDateString("en-US", { month: "long" })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Wind className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <div className="font-medium">Status</div>
                    <Badge variant="secondary">{tournament.status}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* AI Planning Options */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">AI-Powered Planning</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => generatePlan("strategy")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fish className="h-5 w-5 text-primary" />
                  Fishing Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get a comprehensive fishing strategy including locations, techniques, and timing for tournament
                  success.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => generatePlan("gear")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Gear Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receive lake-specific tackle recommendations and essential gear for optimal tournament preparation.
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => generatePlan("conditions")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-primary" />
                  Conditions Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analyze expected weather and water conditions with strategic adjustments for tournament day.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Custom Question
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Ask a specific question about this tournament..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={() => generatePlan("custom")} disabled={!customPrompt.trim()} className="w-full">
                  Ask AI
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Response */}
        {(isGenerating || plan) && (
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Tournament Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Generating your tournament plan...</span>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{plan}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Tips */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Use AI planning 2-3 days before the tournament for best results</p>
              <p>• Combine AI insights with local knowledge and recent fishing reports</p>
              <p>• Always have backup plans for changing weather conditions</p>
              <p>• Practice recommended techniques before tournament day</p>
              <p>• Share successful strategies with the team after tournaments</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
