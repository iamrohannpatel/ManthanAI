// Semantic Scholar API utility functions
const SEMANTIC_SCHOLAR_BASE_URL = 'https://api.semanticscholar.org/graph/v1'

/**
 * Search for papers by DOI
 * @param {string} doi - The DOI of the paper
 * @returns {Promise<Object>} Paper data from Semantic Scholar
 */
export async function getPaperByDOI(doi) {
  try {
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/DOI:${doi}?fields=paperId,title,abstract,authors,year,venue,citationCount,referenceCount,isOpenAccess,openAccessPdf,fieldsOfStudy,citations,references`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching paper by DOI:', error)
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
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/arXiv:${arxivId}?fields=paperId,title,abstract,authors,year,venue,citationCount,referenceCount,isOpenAccess,openAccessPdf,fieldsOfStudy,citations,references`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching paper by ArXiv ID:', error)
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
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/search?query=${encodeURIComponent(title)}&limit=10&fields=paperId,title,abstract,authors,year,venue,citationCount,referenceCount,isOpenAccess,openAccessPdf,fieldsOfStudy`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error searching papers by title:', error)
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
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/${paperId}/citations?fields=paperId,title,authors,year,venue,citationCount&limit=50`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching paper citations:', error)
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
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/${paperId}/references?fields=paperId,title,authors,year,venue,citationCount&limit=50`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching paper references:', error)
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
    const response = await fetch(`${SEMANTIC_SCHOLAR_BASE_URL}/paper/${paperId}/recommendations?fields=paperId,title,authors,year,venue,citationCount,abstract&limit=10`)
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching related papers:', error)
    throw error
  }
}
