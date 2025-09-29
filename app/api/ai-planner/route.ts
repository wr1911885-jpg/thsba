import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an expert bass fishing tournament advisor with deep knowledge of North Texas lakes and competitive fishing strategies. 

${prompt}

Please provide detailed, actionable advice that would help high school bass fishing team members succeed in their tournament. Focus on practical tips, specific techniques, and strategic thinking that applies to competitive bass fishing in North Texas lakes.

Format your response in a clear, organized manner with specific recommendations.`,
    })

    return Response.json({ plan: text })
  } catch (error) {
    console.error("Error generating AI plan:", error)
    return Response.json({ error: "Failed to generate plan" }, { status: 500 })
  }
}
