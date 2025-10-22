// Google Gemini API utility functions
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent'
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

if (!GEMINI_API_KEY && !DEMO_MODE) {
  // Surface a clear error early to guide setup
  console.error('Missing environment variable VITE_GEMINI_API_KEY for Gemini API')
}

/**
 * Analyze academic paper using Gemini API
 * @param {string} text - The paper text or abstract
 * @param {string} title - The paper title
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzePaper(text, title) {
  try {
    if (DEMO_MODE) {
      return {
        summary: `Demo analysis for: ${title}. This is a mocked summary generated in demo mode.`,
        keyTopics: ['AI Analysis', 'Semantic Scholar', 'Research Synthesis'],
        researchGaps: ['Limited dataset coverage', 'Methodological consistency'],
        crossDomainIdeas: ['Apply methods to healthcare', 'Use in education analytics'],
        methodology: 'Heuristic demo synthesis',
        contributions: ['Demo insights', 'Prototype behavior'],
        futureWork: 'Connect to real AI providers for production analysis'
      }
    }
    if (!GEMINI_API_KEY) {
      throw new Error('Missing VITE_GEMINI_API_KEY. Add it to .env (see .env.example).')
    }
    const prompt = `
Analyze this academic paper and provide insights in the following JSON format:

{
  "summary": "Brief 2-3 sentence summary of the paper",
  "keyTopics": ["topic1", "topic2", "topic3"],
  "researchGaps": ["gap1", "gap2"],
  "crossDomainIdeas": ["idea1", "idea2"],
  "methodology": "Brief description of research methodology",
  "contributions": ["contribution1", "contribution2"],
  "futureWork": "Suggestions for future research directions"
}

Paper Title: ${title}
Paper Content: ${text.substring(0, 8000)} // Limit to avoid token limits
`

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const analysisText = data.candidates[0].content.parts[0].text
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON from Gemini response:', parseError)
    }

    // Fallback: return structured response
    return {
      summary: analysisText.substring(0, 200) + '...',
      keyTopics: ['Research Analysis'],
      researchGaps: ['Analysis in progress'],
      crossDomainIdeas: ['Cross-domain insights'],
      methodology: 'AI Analysis',
      contributions: ['Automated insights'],
      futureWork: 'Further analysis needed'
    }

  } catch (error) {
    console.error('Error analyzing paper with Gemini:', error)
    throw error
  }
}

/**
 * Generate related research suggestions
 * @param {string} topic - The research topic
 * @returns {Promise<Array>} Array of suggested research directions
 */
export async function generateResearchSuggestions(topic) {
  try {
    const prompt = `
Based on the research topic "${topic}", suggest 5 specific research directions or questions that could be explored. 
Format as a JSON array of strings:
["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]
`

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const suggestionsText = data.candidates[0].content.parts[0].text
    
    try {
      const jsonMatch = suggestionsText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.warn('Failed to parse suggestions JSON:', parseError)
    }

    return [
      'Explore interdisciplinary applications',
      'Investigate scalability challenges',
      'Study long-term implications',
      'Examine ethical considerations',
      'Develop novel methodologies'
    ]

  } catch (error) {
    console.error('Error generating research suggestions:', error)
    return [
      'Further investigation needed',
      'Cross-disciplinary research opportunities',
      'Methodological improvements',
      'Practical applications',
      'Theoretical extensions'
    ]
  }
}
