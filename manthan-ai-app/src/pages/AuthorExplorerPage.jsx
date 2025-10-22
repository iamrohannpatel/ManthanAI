import { useState } from 'react'
import { Search, User, Users, TrendingUp, Calendar, Award, Network, BookOpen, ArrowRight } from 'lucide-react'
import { searchAuthor, getAuthorPapers } from '../utils/semanticScholarAPI'
import GraphView from '../components/GraphView'
import toast from 'react-hot-toast'

function AuthorExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [author, setAuthor] = useState(null)
  const [authorPapers, setAuthorPapers] = useState([])
  const [collaborators, setCollaborators] = useState([])
  const [selectedPaper, setSelectedPaper] = useState(null)

  const handleSearchAuthor = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter an author name')
      return
    }

    setIsSearching(true)
    setAuthor(null)
    setAuthorPapers([])
    setCollaborators([])

    try {
      toast.loading('Searching for author...', { id: 'author-search' })
      
      // Search for author
      const authorResults = await searchAuthor(searchQuery)
      if (authorResults.length === 0) {
        toast.error('No author found with that name', { id: 'author-search' })
        return
      }

      const selectedAuthor = authorResults[0] // Take the first result
      setAuthor(selectedAuthor)
      toast.success(`Found author: ${selectedAuthor.name}`, { id: 'author-search' })

      // Get author's papers
      toast.loading('Fetching author papers...', { id: 'papers' })
      const papers = await getAuthorPapers(selectedAuthor.authorId, 20)
      setAuthorPapers(papers)
      toast.success(`Found ${papers.length} papers`, { id: 'papers' })

      // Extract collaborators
      const collaboratorMap = new Map()
      papers.forEach(paper => {
        if (paper.authors) {
          paper.authors.forEach(author => {
            if (author.authorId !== selectedAuthor.authorId) {
              const existing = collaboratorMap.get(author.authorId) || {
                ...author,
                collaborationCount: 0,
                papers: []
              }
              existing.collaborationCount++
              existing.papers.push(paper)
              collaboratorMap.set(author.authorId, existing)
            }
          })
        }
      })

      const sortedCollaborators = Array.from(collaboratorMap.values())
        .sort((a, b) => b.collaborationCount - a.collaborationCount)
        .slice(0, 10)

      setCollaborators(sortedCollaborators)

    } catch (error) {
      console.error('Error searching author:', error)
      toast.error(`Failed to search author: ${error.message}`)
    } finally {
      setIsSearching(false)
    }
  }

  const getAuthorStats = () => {
    if (!author || !authorPapers.length) return null

    const totalCitations = authorPapers.reduce((sum, paper) => sum + (paper.citationCount || 0), 0)
    const years = authorPapers.map(p => p.year).filter(Boolean)
    const yearRange = years.length > 0 ? {
      start: Math.min(...years),
      end: Math.max(...years)
    } : null

    const topVenues = authorPapers
      .map(p => p.venue)
      .filter(Boolean)
      .reduce((acc, venue) => {
        acc[venue] = (acc[venue] || 0) + 1
        return acc
      }, {})

    const topVenue = Object.entries(topVenues)
      .sort(([,a], [,b]) => b - a)[0]

    return {
      totalPapers: authorPapers.length,
      totalCitations,
      yearRange,
      topVenue: topVenue ? { name: topVenue[0], count: topVenue[1] } : null,
      hIndex: calculateHIndex(authorPapers)
    }
  }

  const calculateHIndex = (papers) => {
    const citations = papers
      .map(p => p.citationCount || 0)
      .sort((a, b) => b - a)
    
    let hIndex = 0
    for (let i = 0; i < citations.length; i++) {
      if (citations[i] >= i + 1) {
        hIndex = i + 1
      } else {
        break
      }
    }
    return hIndex
  }

  const stats = getAuthorStats()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-poppins-bold text-gray-900 dark:text-white mb-6">
              Author Explorer
            </h1>
            <p className="text-xl font-poppins-medium text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Discover researchers, their work, and collaboration networks in your field of interest.
            </p>
          </div>
        </div>
      </div>

      {/* Intro: What it is + Features */}
      <div className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="card p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-poppins-semibold text-gray-900 dark:text-white mb-1">What is Author Explorer?</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    A focused view into a researcher’s impact, collaborations, and publication trail. Discover who they work with, where they publish, and how their influence evolves.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: Network, title: 'Collaboration Graph', desc: 'Visualize core co-authors and the strength of their connections.' },
                { icon: TrendingUp, title: 'Career Trajectory', desc: 'Track years active, venues, citations and h-index at a glance.' },
                { icon: BookOpen, title: 'Recent Work', desc: 'Skim latest papers with quick access to year and citations.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-poppins-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-poppins-semibold text-gray-900 dark:text-white mb-4">
                  Search for an Author
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter the name of a researcher to explore their work and collaborations
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., Geoffrey Hinton, Yann LeCun, Fei-Fei Li"
                    className="input-field pl-12 text-lg"
                    disabled={isSearching}
                  />
                </div>

                {/* Example quick picks */}
                <div className="flex flex-wrap gap-2">
                  {['Geoffrey Hinton','Yann LeCun','Fei-Fei Li','Andrew Ng','Demis Hassabis'].map(name => (
                    <button
                      key={name}
                      onClick={() => setSearchQuery(name)}
                      className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      type="button"
                    >
                      {name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSearchAuthor}
                  disabled={isSearching || !searchQuery.trim()}
                  className="btn-primary w-full flex items-center justify-center space-x-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Explore Author</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author Profile */}
      {author && (
        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="card p-8 mb-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/3">
                    <div className="text-center lg:text-left">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-2xl font-poppins-bold text-gray-900 dark:text-white mb-2">
                        {author.name}
                      </h2>
                      {author.affiliations && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {author.affiliations[0]?.name}
                        </p>
                      )}
                      {author.homepage && (
                        <a 
                          href={author.homepage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Visit Homepage
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="lg:w-2/3">
                    {stats && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-poppins-bold text-gray-900 dark:text-white">
                            {stats.totalPapers}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Papers</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-poppins-bold text-gray-900 dark:text-white">
                            {stats.totalCitations.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Citations</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-poppins-bold text-gray-900 dark:text-white">
                            {stats.hIndex}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">H-Index</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-poppins-bold text-gray-900 dark:text-white">
                            {stats.yearRange ? `${stats.yearRange.start}-${stats.yearRange.end}` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Active Years</div>
                        </div>
                      </div>
                    )}

                    {author.bio && (
                      <div className="mb-6">
                        <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white mb-2">
                          Biography
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {author.bio}
                        </p>
                      </div>
                    )}

                    {stats?.topVenue && (
                      <div>
                        <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white mb-2">
                          Most Published Venue
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {stats.topVenue.name} ({stats.topVenue.count} papers)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Collaboration Network */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="card p-6">
                  <h3 className="text-xl font-poppins-semibold text-gray-900 dark:text-white mb-4">
                    Collaboration Network
                  </h3>
                  <div className="h-96">
                    {collaborators.length > 0 ? (
                      <GraphView 
                        papers={authorPapers}
                        selectedPaper={selectedPaper}
                        showCollaborations={true}
                        collaborators={collaborators}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                          <Network className="w-12 h-12 mx-auto mb-2" />
                          <p>No collaboration data available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Top Collaborators */}
                  <div className="card p-6">
                    <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white mb-4">
                      Top Collaborators
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {collaborators.map((collaborator, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-poppins-medium text-gray-900 dark:text-white">
                              {collaborator.name}
                            </h4>
                            {collaborator.affiliations && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {collaborator.affiliations[0]?.name}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-poppins-semibold text-blue-600 dark:text-blue-400">
                              {collaborator.collaborationCount} papers
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Papers */}
                  <div className="card p-6">
                    <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white mb-4">
                      Recent Papers
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {authorPapers.slice(0, 5).map((paper, index) => (
                        <div 
                          key={index} 
                          className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => setSelectedPaper(paper)}
                        >
                          <h4 className="font-poppins-medium text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {paper.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{paper.year}</span>
                            <span>{paper.citationCount || 0} citations</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthorExplorerPage
