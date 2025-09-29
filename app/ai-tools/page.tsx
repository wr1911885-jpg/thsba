"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Fish, ArrowLeft, Sparkles, MapPin, Thermometer, Target, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AIToolsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [response, setResponse] = useState("")
  const [prompt, setPrompt] = useState("")

  const generateResponse = async (toolType: string, customPrompt?: string) => {
    setIsGenerating(true)
    setResponse("")

    try {
      let fullPrompt = ""

      switch (toolType) {
        case "technique":
          fullPrompt =
            "Recommend bass fishing techniques for current North Texas lake conditions. Include lure selection, presentation methods, and seasonal considerations."
          break
        case "location":
          fullPrompt =
            "Suggest productive bass fishing locations and structure types to target on North Texas lakes. Include depth ranges and seasonal patterns."
          break
        case "conditions":
          fullPrompt =
            "Analyze how current weather and water conditions affect bass behavior and fishing success. Provide adjustment strategies."
          break
        case "custom":
          fullPrompt = customPrompt || prompt
          break
      }

      const apiResponse = await fetch("/api/ai-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      })

      if (!apiResponse.ok) {
        throw new Error("Failed to generate response")
      }

      const data = await apiResponse.json()
      setResponse(data.plan)
    } catch (error) {
      console.error("Error generating response:", error)
      setResponse("Sorry, I couldn't generate a response right now. Please try again later.")
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
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">AI Fishing Tools</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Header */}
        <section className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold">AI-Powered Fishing Assistant</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get expert fishing advice powered by AI. Ask questions about techniques, locations, conditions, and
            strategies for North Texas bass fishing.
          </p>
        </section>

        {/* Quick Tools */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Quick Tools</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => generateResponse("technique")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Technique Advisor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get recommendations for the best fishing techniques and lure selections for current conditions.
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => generateResponse("location")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location Finder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Discover productive fishing spots and structure types to target on North Texas lakes.
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => generateResponse("conditions")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-primary" />
                  Conditions Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Understand how weather and water conditions affect bass behavior and fishing success.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Custom Question */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Ask the AI Expert
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ask any fishing question... (e.g., 'What's the best way to fish a spinnerbait in muddy water?' or 'How do I find bass in cold weather?')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
              />
              <Button
                onClick={() => generateResponse("custom")}
                disabled={!prompt.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Advice
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* AI Response */}
        {(isGenerating || response) && (
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fish className="h-5 w-5 text-primary" />
                  AI Expert Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Generating expert advice...</span>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{response}</div>
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
              <CardTitle>How to Get the Best AI Advice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Be specific about your situation (lake, weather, time of year)</p>
              <p>• Ask about particular techniques or lures you want to learn</p>
              <p>• Include details about water conditions when relevant</p>
              <p>• Ask follow-up questions to dive deeper into topics</p>
              <p>• Combine AI advice with local knowledge and experience</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
