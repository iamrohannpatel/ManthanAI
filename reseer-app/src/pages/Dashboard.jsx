import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../utils/firebaseConfig'
import SavedPaperCard from '../components/SavedPaperCard'
import GraphView from '../components/GraphView'

function Dashboard() {
  const { currentUser } = useAuth()
  const [savedPapers, setSavedPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPaper, setSelectedPaper] = useState(null)

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, 'papers'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const papers = []
      snapshot.forEach((doc) => {
        papers.push({ id: doc.id, ...doc.data() })
      })
      setSavedPapers(papers)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your saved research insights will appear here.
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Research Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {currentUser.displayName || currentUser.email}!
          </p>
        </div>

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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Papers List */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Saved Papers ({savedPapers.length})
              </h2>
              <div className="space-y-4">
                {savedPapers.map((paper) => (
                  <SavedPaperCard
                    key={paper.id}
                    paper={paper}
                    isSelected={selectedPaper?.id === paper.id}
                    onClick={() => setSelectedPaper(paper)}
                  />
                ))}
              </div>
            </div>

            {/* Visualization */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Research Network
              </h2>
              <div className="card h-96">
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
        )}
      </div>
    </div>
  )
}

export default Dashboard
