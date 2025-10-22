// Semantic Scholar API utility functions
const SEMANTIC_SCHOLAR_BASE_URL = 'https://api.semanticscholar.org/graph/v1'
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

/**
 * Search for papers by DOI
 * @param {string} doi - The DOI of the paper
 * @returns {Promise<Object>} Paper data from Semantic Scholar
 */
export async function getPaperByDOI(doi) {
  try {
    if (DEMO_MODE) {
      return {
        paperId: 'demo-doi-paper',
        title: `Demo Paper for DOI ${doi}`,
        abstract: 'This is a demo abstract for the DOI-based paper in prototype mode.',
        authors: [{ name: 'Alice Demo' }, { name: 'Bob Prototype' }],
        year: 2024,
        venue: 'DemoConf',
        citationCount: 42,
        isOpenAccess: true,
        fieldsOfStudy: ['Computer Science']
      }
    }
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/DOI:${doi}?fields=paperId,title,abstract,authors,year,venue,citationCount,referenceCount,isOpenAccess,openAccessPdf,fieldsOfStudy,citations,references`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching paper by DOI:', error)
    if (DEMO_MODE) {
      return {
        paperId: 'demo-doi-fallback',
        title: `Demo Paper (fallback) for DOI ${doi}`,
        abstract: 'Demo fallback due to network error.',
        authors: [{ name: 'Demo Author' }],
        year: 2023,
        venue: 'Demo Venue',
        citationCount: 5
      }
    }
    throw error
  }
}

/**
 * Search for papers by ArXiv ID
 * @param {string} arxivId - The ArXiv ID of the paper
 * @returns {Promise<Object>} Paper data from Semantic Scholar
 */
export async function getPaperByArXiv(arxivId) {
  try {
    if (DEMO_MODE) {
      return {
        paperId: 'demo-arxiv-paper',
        title: `Demo Paper for arXiv ${arxivId}`,
        abstract: 'This is a demo abstract for the arXiv-based paper in prototype mode.',
        authors: [{ name: 'Carol Demo' }, { name: 'Dave Prototype' }],
        year: 2022,
        venue: 'ArXiv',
        citationCount: 17,
        isOpenAccess: true,
        fieldsOfStudy: ['AI']
      }
    }
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/arXiv:${arxivId}?fields=paperId,title,abstract,authors,year,venue,citationCount,referenceCount,isOpenAccess,openAccessPdf,fieldsOfStudy,citations,references`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching paper by ArXiv ID:', error)
    if (DEMO_MODE) {
      return {
        paperId: 'demo-arxiv-fallback',
        title: `Demo Paper (fallback) for arXiv ${arxivId}`,
        abstract: 'Demo fallback due to network error.',
        authors: [{ name: 'Demo Author' }],
        year: 2021,
        venue: 'ArXiv',
        citationCount: 3
      }
    }
    throw error
  }
}

/**
 * Search for papers by title
 * @param {string} title - The title of the paper
 * @returns {Promise<Array>} Array of matching papers
 */
export async function searchPapersByTitle(title) {
  try {
    if (DEMO_MODE) {
      return [
        { paperId: 'demo-1', title: `${title} - A Demo Study`, abstract: 'Demo abstract', authors: [{ name: 'A' }], year: 2020, venue: 'DemoSymp', citationCount: 10 },
        { paperId: 'demo-2', title: `${title} - Prototype Analysis`, abstract: 'Prototype abstract', authors: [{ name: 'B' }], year: 2021, venue: 'ProtoConf', citationCount: 5 },
      ]
    }
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/search?query=${encodeURIComponent(title)}&limit=10&fields=paperId,title,abstract,authors,year,venue,citationCount,referenceCount,isOpenAccess,openAccessPdf,fieldsOfStudy`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error searching papers by title:', error)
    if (DEMO_MODE) {
      return []
    }
    throw error
  }
}

/**
 * Get citations for a paper
 * @param {string} paperId - The Semantic Scholar paper ID
 * @returns {Promise<Array>} Array of citing papers
 */
export async function getPaperCitations(paperId) {
  try {
    if (DEMO_MODE) {
      return []
    }
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/${paperId}/citations?fields=paperId,title,authors,year,venue,citationCount&limit=50`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching paper citations:', error)
    if (DEMO_MODE) return []
    throw error
  }
}

/**
 * Get references for a paper
 * @param {string} paperId - The Semantic Scholar paper ID
 * @returns {Promise<Array>} Array of referenced papers
 */
export async function getPaperReferences(paperId) {
  try {
    if (DEMO_MODE) {
      return []
    }
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/${paperId}/references?fields=paperId,title,authors,year,venue,citationCount&limit=50`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching paper references:', error)
    if (DEMO_MODE) return []
    throw error
  }
}

/**
 * Get related papers
 * @param {string} paperId - The Semantic Scholar paper ID
 * @returns {Promise<Array>} Array of related papers
 */
export async function getRelatedPapers(paperId) {
  try {
    if (DEMO_MODE) {
      return []
    }
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/${paperId}/recommendations?fields=paperId,title,authors,year,venue,citationCount,abstract&limit=10`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching related papers:', error)
    if (DEMO_MODE) return []
    throw error
  }
}

// Demo-supported APIs used by pages
export async function searchAuthor(name, limit = 10) {
  try {
    if (DEMO_MODE) {
      return [
        { authorId: 'demo-auth-1', name: `${name} Demo`, homepage: 'https://example.com', affiliations: [{ name: 'Demo University' }], hIndex: 25, paperCount: 50, citationCount: 1234 },
        { authorId: 'demo-auth-2', name: `${name} Prototype`, affiliations: [{ name: 'Prototype Labs' }], hIndex: 18, paperCount: 30, citationCount: 567 },
      ]
    }
    const url = `${SEMANTIC_SCHOLAR_BASE_URL}/author/search?query=${encodeURIComponent(name)}&limit=${limit}&fields=authorId,name,homepage,affiliations,hIndex,paperCount,citationCount,aliases`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error searching authors:', error)
    if (DEMO_MODE) return []
    throw error
  }
}

export async function getAuthorPapers(authorId, limit = 20) {
  try {
    if (DEMO_MODE) {
      return Array.from({ length: Math.min(limit, 10) }).map((_, i) => ({
        paperId: `demo-author-paper-${i + 1}`,
        title: `Demo Paper ${i + 1} by ${authorId}`,
        year: 2018 + (i % 7),
        venue: 'DemoVenue',
        citationCount: Math.floor(Math.random() * 200),
        authors: [
          { authorId, name: 'Selected Author' },
          { authorId: `co-${i}`, name: `CoAuthor ${i}` }
        ],
      }))
    }
    const url = `${SEMANTIC_SCHOLAR_BASE_URL}/author/${authorId}/papers?limit=${limit}&fields=paperId,title,year,venue,citationCount,authors`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }
    const data = await response.json()
    if (Array.isArray(data.data)) {
      return data.data.map(item => {
        const p = item.paper || item
        return {
          paperId: p.paperId,
          title: p.title,
          year: p.year,
          venue: p.venue,
          citationCount: p.citationCount,
          authors: p.authors,
        }
      })
    }
    return []
  } catch (error) {
    console.error('Error fetching author papers:', error)
    if (DEMO_MODE) return []
    throw error
  }
}

/**
 * Search papers by a general topic query (alias wrapper used by UI)
 * @param {string} query - Topic or keywords
 * @param {number} limit - Max results
 * @returns {Promise<Array>} Array of papers with title, abstract, authors, year, venue, citationCount
 */
export async function searchPapers(query, limit = 10) {
  try {
    const url = `${SEMANTIC_SCHOLAR_BASE_URL}/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&fields=paperId,title,abstract,authors,year,venue,citationCount,referenceCount,isOpenAccess,openAccessPdf,fieldsOfStudy`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error searching papers:', error)
    throw error
  }
}
