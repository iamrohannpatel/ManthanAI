import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import HeroSection from '../components/HomePage/HeroSection'
import AnalysisStatus from '../components/HomePage/AnalysisStatus'
import UploadBox from '../components/UploadBox'
import AnalysisResults from '../components/AnalysisResults'
import Container from '../components/ui/Container'
import Section from '../components/ui/Section'
import { analyzePaper } from '../utils/geminiAPI'
import { analyzePaperWithDeepSeek } from '../utils/deepseekAPI'
import { getPaperByDOI, getPaperByArXiv } from '../utils/semanticScholarAPI'
import toast from 'react-hot-toast'

function HomePage() {
  const { currentUser, signInWithGoogle } = useAuth()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [paperData, setPaperData] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(null)
  const analysisSectionRef = useRef(null)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const [hasShownPrompt, setHasShownPrompt] = useState(false)

  useEffect(() => {
    if (currentUser) return

    const triggerPrompt = () => {
      if (!hasShownPrompt) {
        setShowSignInPrompt(true)
        setHasShownPrompt(true)
      }
    }

    const onWheel = () => triggerPrompt()
    const onTouch = () => triggerPrompt()
    const onKey = (e) => {
      const keys = ['ArrowDown', 'PageDown', 'Space']
      if (keys.includes(e.code) || keys.includes(e.key)) triggerPrompt()
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('keydown', onKey)
    }
  }, [currentUser, hasShownPrompt])

  const handleAnalysis = async (inputData) => {
    setIsAnalyzing(true)
    setAnalysisResults(null)
    setPaperData(null)
    setError(null)
    setCurrentStep(0)

    try {
      let paperInfo = null
      let textToAnalyze = ''

      // Step 1: Extract text
      setCurrentStep(1)
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

      // Step 2: AI Analysis
      setCurrentStep(2)
      const [geminiAnalysis, deepseekAnalysis] = await Promise.allSettled([
        analyzePaper(textToAnalyze, paperInfo.title),
        analyzePaperWithDeepSeek(textToAnalyze, paperInfo.title)
      ])

      // Step 3: Building Network
      setCurrentStep(3)
      const analysis = {
        ...geminiAnalysis.value,
        ...deepseekAnalysis.value,
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
        summary: deepseekAnalysis.value?.summary || geminiAnalysis.value?.summary,
        strengths: deepseekAnalysis.value?.strengths || [],
        limitations: deepseekAnalysis.value?.limitations || [],
        relevanceScore: deepseekAnalysis.value?.relevanceScore || 7.5
      }

      setPaperData(paperInfo)
      setAnalysisResults(analysis)
      toast.success('Paper analyzed successfully!')

    } catch (error) {
      console.error('Analysis error:', error)
      setError(error)
      toast.error(`Analysis failed: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const scrollToAnalysis = () => {
    analysisSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Sign-in Prompt Modal */}
      {!currentUser && showSignInPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSignInPrompt(false)} />
          <div className="relative z-[61] w-full max-w-md card p-6">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white">Save your progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Sign in to save analyses and build your personal knowledge base.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSignInPrompt(false)}
                className="btn-outline px-4 py-2 text-sm"
              >
                Maybe later
              </button>
              <button
                onClick={async () => { try { await signInWithGoogle(); setShowSignInPrompt(false) } catch {} }}
                className="btn-primary px-4 py-2 text-sm"
              >
                Sign In
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">New here? Sign up happens automatically with Google in one click.</div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <Section padded={true}>
        <Container>
          <HeroSection onScrollToAnalysis={scrollToAnalysis} />
        </Container>
      </Section>

      {/* Analysis Section */}
      <Section padded={true}>
        <Container ref={analysisSectionRef}>
          <div className="max-w-4xl mx-auto">
            <UploadBox onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
          </div>

          {/* Analysis Status */}
          {isAnalyzing && (
            <div className="mt-8">
              <AnalysisStatus isAnalyzing={isAnalyzing} currentStep={currentStep} totalSteps={3} />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-8">
              <AnalysisStatus isAnalyzing={false} error={error} />
            </div>
          )}

          {/* Analysis Results */}
          {analysisResults && paperData && (
            <div className="mt-12">
              <AnalysisResults analysis={analysisResults} paperData={paperData} />
            </div>
          )}
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="bg-white dark:bg-gray-800">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose ManthanAI?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced AI-powered research analysis that transforms how you discover and understand academic knowledge.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card-hover text-center p-8 animate-slide-up">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Analysis</h3>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Citation Mapping</h3>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Research Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Get personalized suggestions for future research directions and collaboration opportunities based on your analysis.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}

export default HomePage
