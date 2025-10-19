import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import UploadBox from '../components/UploadBox'
import AnalysisResults from '../components/AnalysisResults'
import { analyzePaper } from '../utils/geminiAPI'
import { analyzePaperWithDeepSeek } from '../utils/deepseekAPI'
import { getPaperByDOI, getPaperByArXiv } from '../utils/semanticScholarAPI'
import toast from 'react-hot-toast'

function Home() {
  const { currentUser } = useAuth()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [paperData, setPaperData] = useState(null)

  const handleAnalysis = async (inputData) => {
    setIsAnalyzing(true)
    setAnalysisResults(null)
    setPaperData(null)

    try {
      let paperInfo = null
      let textToAnalyze = ''

      // Handle different input types
      if (inputData.type === 'pdf') {
        textToAnalyze = inputData.text
        paperInfo = {
          title: inputData.metadata?.title || 'PDF Document',
          authors: inputData.metadata?.author || 'Unknown',
          year: new Date().getFullYear(),
          source: 'PDF Upload'
        }
      } else if (inputData.type === 'doi') {
        const paper = await getPaperByDOI(inputData.value)
        paperInfo = {
          title: paper.title,
          authors: paper.authors?.map(a => a.name).join(', ') || 'Unknown',
          year: paper.year,
          venue: paper.venue,
          citationCount: paper.citationCount,
          source: 'DOI'
        }
        textToAnalyze = paper.abstract || ''
      } else if (inputData.type === 'arxiv') {
        const paper = await getPaperByArXiv(inputData.value)
        paperInfo = {
          title: paper.title,
          authors: paper.authors?.map(a => a.name).join(', ') || 'Unknown',
          year: paper.year,
          venue: paper.venue,
          citationCount: paper.citationCount,
          source: 'ArXiv'
        }
        textToAnalyze = paper.abstract || ''
      }

      if (!textToAnalyze) {
        throw new Error('No text content available for analysis')
      }

      // Analyze the paper using both Gemini and DeepSeek for comprehensive insights
      const [geminiAnalysis, deepseekAnalysis] = await Promise.allSettled([
        analyzePaper(textToAnalyze, paperInfo.title),
        analyzePaperWithDeepSeek(textToAnalyze, paperInfo.title)
      ])

      // Combine insights from both APIs
      const analysis = {
        ...geminiAnalysis.value,
        ...deepseekAnalysis.value,
        // Merge arrays and remove duplicates
        keyTopics: [...new Set([
          ...(geminiAnalysis.value?.keyTopics || []),
          ...(deepseekAnalysis.value?.keyTopics || [])
        ])],
        researchGaps: [...new Set([
          ...(geminiAnalysis.value?.researchGaps || []),
          ...(deepseekAnalysis.value?.researchGaps || [])
        ])],
        crossDomainIdeas: [...new Set([
          ...(geminiAnalysis.value?.crossDomainIdeas || []),
          ...(deepseekAnalysis.value?.crossDomainIdeas || [])
        ])],
        contributions: [...new Set([
          ...(geminiAnalysis.value?.contributions || []),
          ...(deepseekAnalysis.value?.contributions || [])
        ])],
        // Use the more detailed summary
        summary: deepseekAnalysis.value?.summary || geminiAnalysis.value?.summary,
        // Add DeepSeek-specific insights
        strengths: deepseekAnalysis.value?.strengths || [],
        limitations: deepseekAnalysis.value?.limitations || [],
        relevanceScore: deepseekAnalysis.value?.relevanceScore || 7.5
      }

      setPaperData(paperInfo)
      setAnalysisResults(analysis)
      toast.success('Paper analyzed successfully!')

    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(`Analysis failed: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            ReSeer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover research insights intelligently with AI-powered analysis, 
            citation mapping, and cross-disciplinary connections.
          </p>
          
          {!currentUser && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                Sign in to save your research insights and build your personal knowledge base.
              </p>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto">
          <UploadBox 
            onAnalyze={handleAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Analysis Results */}
        {analysisResults && paperData && (
          <div className="mt-12">
            <AnalysisResults 
              analysis={analysisResults}
              paperData={paperData}
            />
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get intelligent summaries, identify research gaps, and discover cross-disciplinary opportunities.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Citation Mapping
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize research networks with interactive citation graphs and discover related work.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Research Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get personalized suggestions for future research directions and collaboration opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
