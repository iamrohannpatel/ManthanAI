// DeepSeek API utility functions via OpenRouter
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL
const DEEPSEEK_MODEL = import.meta.env.VITE_DEEPSEEK_MODEL

/**
 * Analyze academic paper using DeepSeek API
 * @param {string} text - The paper text or abstract
 * @param {string} title - The paper title
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzePaperWithDeepSeek(text, title) {
  try {
    const prompt = `
You are an expert research analyst. Analyze this academic paper and provide insights in the following JSON format:

{
  "summary": "Brief 2-3 sentence summary of the paper",
  "keyTopics": ["topic1", "topic2", "topic3"],
  "researchGaps": ["gap1", "gap2"],
  "crossDomainIdeas": ["idea1", "idea2"],
  "methodology": "Brief description of research methodology",
  "contributions": ["contribution1", "contribution2"],
  "futureWork": "Suggestions for future research directions",
  "strengths": ["strength1", "strength2"],
  "limitations": ["limitation1", "limitation2"],
  "relevanceScore": 8.5
}

Paper Title: ${title}
Paper Content: ${text.substring(0, 8000)} // Limit to avoid token limits

Please provide a comprehensive analysis focusing on research insights, gaps, and opportunities.
`

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ReSeer Research Analysis'
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON from DeepSeek response:', parseError)
    }

    // Fallback: return structured response
    return {
      summary: analysisText.substring(0, 200) + '...',
      keyTopics: ['Research Analysis'],
      researchGaps: ['Analysis in progress'],
      crossDomainIdeas: ['Cross-domain insights'],
      methodology: 'AI Analysis',
      contributions: ['Automated insights'],
      futureWork: 'Further analysis needed',
      strengths: ['Comprehensive analysis'],
      limitations: ['AI-generated insights'],
      relevanceScore: 7.5
    }

  } catch (error) {
    console.error('Error analyzing paper with DeepSeek:', error)
    throw error
  }
}

/**
 * Generate research suggestions using DeepSeek
 * @param {string} topic - The research topic
 * @returns {Promise<Array>} Array of suggested research directions
 */
export async function generateResearchSuggestionsWithDeepSeek(topic) {
  try {
    const prompt = `
Based on the research topic "${topic}", suggest 5 specific research directions or questions that could be explored. 
Format as a JSON array of strings:
["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]

Focus on innovative, practical, and impactful research opportunities.
`

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ReSeer Research Suggestions'
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    const suggestionsText = data.choices[0].message.content
    
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

/**
 * Compare papers using DeepSeek
 * @param {Array} papers - Array of paper objects
 * @returns {Promise<Object>} Comparison analysis
 */
export async function comparePapersWithDeepSeek(papers) {
  try {
    const papersText = papers.map((paper, index) => 
      `Paper ${index + 1}: ${paper.title}\n${paper.summary || paper.abstract || ''}`
    ).join('\n\n')

    const prompt = `
Compare these research papers and provide insights:

${papersText}

Provide a JSON response with:
{
  "similarities": ["similarity1", "similarity2"],
  "differences": ["difference1", "difference2"],
  "complementaryAspects": ["aspect1", "aspect2"],
  "synthesisOpportunities": ["opportunity1", "opportunity2"],
  "overallAssessment": "Brief assessment of the research landscape"
}
`

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ReSeer Paper Comparison'
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    const comparisonText = data.choices[0].message.content
    
    try {
      const jsonMatch = comparisonText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.warn('Failed to parse comparison JSON:', parseError)
    }

    return {
      similarities: ['Common research themes'],
      differences: ['Different methodologies'],
      complementaryAspects: ['Complementary findings'],
      synthesisOpportunities: ['Integration possibilities'],
      overallAssessment: 'Papers show interesting research directions'
    }

  } catch (error) {
    console.error('Error comparing papers with DeepSeek:', error)
    throw error
  }
}
