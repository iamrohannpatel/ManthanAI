import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../utils/firebaseConfig'
import SavedPaperCard from '../components/SavedPaperCard'
import GraphView from '../components/GraphView'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import SearchAndFilterBar from '../components/dashboard/SearchAndFilterBar'
import ComparativeAnalysis from '../components/dashboard/ComparativeAnalysis'
import { CheckSquare, Square, BarChart3 } from 'lucide-react'

function Dashboard() {
  const { currentUser } = useAuth()
  const [savedPapers, setSavedPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [selectedPapers, setSelectedPapers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filters, setFilters] = useState({
    dateRange: 'all',
    citationCount: 'all',
    topic: 'all'
  })
  const [showComparativeAnalysis, setShowComparativeAnalysis] = useState(false)

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, 'papers'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const papers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setSavedPapers(papers)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser])

  const handlePaperSelect = (paper) => {
    if (selectedPapers.find(p => p.id === paper.id)) {
      setSelectedPapers(selectedPapers.filter(p => p.id !== paper.id))
    } else {
      setSelectedPapers([...selectedPapers, paper])
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleSort = (sortBy, sortOrder) => {
    setSortBy(sortBy)
    setSortOrder(sortOrder)
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
  }

  const filteredPapers = savedPapers.filter(paper => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = paper.title?.toLowerCase().includes(query)
      const matchesAuthors = paper.authors?.some(author => 
        author.name?.toLowerCase().includes(query)
      )
      if (!matchesTitle && !matchesAuthors) return false
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const paperDate = new Date(paper.createdAt?.toDate() || paper.year)
      
      switch (filters.dateRange) {
        case 'week':
          if (now - paperDate > 7 * 24 * 60 * 60 * 1000) return false
          break
        case 'month':
          if (now - paperDate > 30 * 24 * 60 * 60 * 1000) return false
          break
        case 'year':
          if (now - paperDate > 365 * 24 * 60 * 60 * 1000) return false
          break
      }
    }

    // Citation count filter
    if (filters.citationCount !== 'all') {
      const citations = paper.citationCount || 0
      switch (filters.citationCount) {
        case 'high':
          if (citations < 100) return false
          break
        case 'medium':
          if (citations < 10 || citations >= 100) return false
          break
        case 'low':
          if (citations >= 10) return false
          break
      }
    }

    return true
  }).sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.createdAt?.toDate() || a.year) - new Date(b.createdAt?.toDate() || b.year)
        break
      case 'citations':
        comparison = (a.citationCount || 0) - (b.citationCount || 0)
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const totalCitations = savedPapers.reduce((sum, paper) => sum + (paper.citationCount || 0), 0)
  const recentActivity = savedPapers.filter(paper => {
    const now = new Date()
    const paperDate = new Date(paper.createdAt?.toDate() || paper.year)
    return now - paperDate <= 7 * 24 * 60 * 60 * 1000
  }).length

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You need to be signed in to view your saved papers and insights.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader 
          savedPapers={savedPapers}
          totalCitations={totalCitations}
          recentActivity={recentActivity}
        />

        <SearchAndFilterBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />

        {savedPapers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No saved papers yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start by analyzing a research paper to see your insights here.
            </p>
            <a 
              href="/" 
              className="btn-primary inline-flex items-center"
            >
              Analyze a Paper
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Comparative Analysis Controls */}
            {selectedPapers.length > 0 && (
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedPapers.length} papers selected
                    </span>
                    <button
                      onClick={() => setSelectedPapers([])}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Clear selection
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowComparativeAnalysis(true)}
                      disabled={selectedPapers.length < 2}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Compare Papers</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Papers List */}
              <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-poppins-semibold text-gray-900 dark:text-white">
                    Saved Papers ({filteredPapers.length})
                  </h2>
                  {selectedPapers.length > 0 && (
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      {selectedPapers.length} selected
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  {filteredPapers.map((paper) => (
                    <div key={paper.id} className="relative">
                      <SavedPaperCard
                        paper={paper}
                        isSelected={selectedPaper?.id === paper.id}
                        onClick={() => setSelectedPaper(paper)}
                      />
                      <button
                        onClick={() => handlePaperSelect(paper)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {selectedPapers.find(p => p.id === paper.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visualization */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Research Network
                </h2>
                <div className="card p-6 h-96">
                  {selectedPaper ? (
                    <GraphView
                      paper={selectedPaper}
                      papers={savedPapers}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      Select a paper to view its research network
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparative Analysis Modal */}
      <ComparativeAnalysis
        selectedPapers={selectedPapers}
        onClose={() => setShowComparativeAnalysis(false)}
        isOpen={showComparativeAnalysis}
      />
    </div>
  )
}

export default Dashboard