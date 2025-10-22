import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../utils/firebaseConfig'
import InsightCard from './InsightCard'
import GraphView from './GraphView'
import toast from 'react-hot-toast'

function AnalysisResults({ analysis, paperData }) {
  const { currentUser } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('insights')

  const handleSavePaper = async () => {
    if (!currentUser) {
      toast.error('Please sign in to save papers')
      return
    }

    setIsSaving(true)
    try {
      await addDoc(collection(db, 'papers'), {
        title: paperData.title,
        authors: paperData.authors,
        year: paperData.year,
        venue: paperData.venue,
        citationCount: paperData.citationCount,
        source: paperData.source,
        summary: analysis.summary,
        keyTopics: analysis.keyTopics,
        researchGaps: analysis.researchGaps,
        crossDomainIdeas: analysis.crossDomainIdeas,
        methodology: analysis.methodology,
        contributions: analysis.contributions,
        futureWork: analysis.futureWork,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      })
      toast.success('Paper saved to your dashboard!')
    } catch (error) {
      console.error('Error saving paper:', error)
      toast.error('Failed to save paper')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Paper Header */}
      <div className="card mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {paperData.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
              <span>By {paperData.authors}</span>
              {paperData.year && <span>• {paperData.year}</span>}
              {paperData.venue && <span>• {paperData.venue}</span>}
              {paperData.citationCount && <span>• {paperData.citationCount} citations</span>}
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {analysis.summary}
            </p>
          </div>
          {currentUser && (
            <button
              onClick={handleSavePaper}
              disabled={isSaving}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Save Paper</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'insights'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          AI Insights
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'network'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Research Network
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'insights' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <InsightCard
            title="Key Topics"
            items={analysis.keyTopics}
            icon="tag"
            color="blue"
          />
          <InsightCard
            title="Research Gaps"
            items={analysis.researchGaps}
            icon="search"
            color="red"
          />
          <InsightCard
            title="Cross-Domain Ideas"
            items={analysis.crossDomainIdeas}
            icon="lightbulb"
            color="green"
          />
          <InsightCard
            title="Contributions"
            items={analysis.contributions}
            icon="star"
            color="purple"
          />
          {analysis.strengths && analysis.strengths.length > 0 && (
            <InsightCard
              title="Strengths"
              items={analysis.strengths}
              icon="thumbs-up"
              color="green"
            />
          )}
          {analysis.limitations && analysis.limitations.length > 0 && (
            <InsightCard
              title="Limitations"
              items={analysis.limitations}
              icon="alert-triangle"
              color="yellow"
            />
          )}
        </div>
      )}

      {activeTab === 'network' && (
        <div className="card h-96">
          <GraphView 
            paper={paperData}
            papers={[paperData]}
            showFullNetwork={false}
          />
        </div>
      )}

      {/* Future Work Section */}
      {analysis.futureWork && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Future Research Directions
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {analysis.futureWork}
          </p>
        </div>
      )}
    </div>
  )
}

export default AnalysisResults
