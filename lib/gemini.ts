import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateFishingAdvice(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const fishingContext = `You are an expert bass fishing guide with extensive knowledge of North Texas lakes including Ray Roberts, Lewisville, Tawakoni, and Cedar Creek. Provide helpful, specific advice for high school bass fishing tournament competitors.`
    
    const result = await model.generateContent(`${fishingContext}\n\nQuestion: ${prompt}`)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating fishing advice:', error)
    throw new Error('Failed to generate fishing advice')
  }
}

export async function generateTournamentStrategy(lake: string, date: string, conditions?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Generate a tournament fishing strategy for ${lake} on ${date}. ${conditions ? `Current conditions: ${conditions}` : ''} Focus on techniques, lures, and locations that would be effective for high school tournament bass fishing.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating tournament strategy:', error)
    throw new Error('Failed to generate tournament strategy')
  }
}