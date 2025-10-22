import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import UploadBox from '../components/UploadBox'
import AnalysisResults from '../components/AnalysisResults'
import { analyzePaper } from '../utils/geminiAPI'
import { analyzePaperWithDeepSeek } from '../utils/deepseekAPI'
import { getPaperByDOI, getPaperByArXiv } from '../utils/semanticScholarAPI'
import toast from 'react-hot-toast'
import Container from '../components/ui/Container'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'

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
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <Section className="pb-0">
        <Container>
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-700 to-primary-400 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
            </div>
            <h1 className="text-6xl font-bold text-gradient mb-6 animate-bounce-in">
              ManthanAI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto text-balance">
              Discover research insights intelligently with AI-powered analysis,
              citation mapping, and cross-disciplinary connections.
            </p>
            {!currentUser && (
              <div className="glass-effect rounded-xl p-6 max-w-md mx-auto animate-slide-up">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-700 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-primary-800 dark:text-primary-200 text-sm">
                    Sign in to save your research insights and build your personal knowledge base.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Upload Section */}
      <Section padded={false} className="py-8">
        <Container className="max-w-4xl">
          <UploadBox onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
        </Container>
      </Section>

      {/* Analysis Results */}
      {analysisResults && paperData && (
        <Section padded={false} className="pt-0">
          <Container>
            <div className="mt-6">
              <AnalysisResults analysis={analysisResults} paperData={paperData} />
            </div>
          </Container>
        </Section>
      )}

      {/* Features Section */}
      <Section>
        <Container className="grid md:grid-cols-3 gap-8">
          <div className="card-hover text-center p-8 animate-slide-up">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Get intelligent summaries, identify research gaps, and discover cross-disciplinary opportunities with advanced AI models.
            </p>
          </div>

          <div className="card-hover text-center p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ManthanAI?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Visualize research networks with interactive citation graphs and discover related work through advanced network analysis.
            </p>
          </div>

          <div className="card-hover text-center p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-20 h-20 bg-gradient-to-br from-primary-700 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Research Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Get personalized suggestions for future research directions and collaboration opportunities based on your analysis.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  )
}

export default Home
