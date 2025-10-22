import { useState } from 'react'
import { Search, BookOpen, TrendingUp, Calendar, Users, Brain, Network, FileText, Sparkles, ArrowRight } from 'lucide-react'
import { analyzePaper } from '../utils/geminiAPI'
import { analyzePaperWithDeepSeek } from '../utils/deepseekAPI'
import { searchPapers } from '../utils/semanticScholarAPI'
import toast from 'react-hot-toast'

function LiteratureReviewPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReview, setGeneratedReview] = useState(null)
  const [selectedPapers, setSelectedPapers] = useState([])
  const [currentStep, setCurrentStep] = useState(0)

  const handleGenerateReview = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a research topic')
      return
    }

    setIsGenerating(true)
    setCurrentStep(0)
    setGeneratedReview(null)
    setSelectedPapers([])

    try {
      // Step 1: Search for relevant papers
      setCurrentStep(1)
      toast.loading('Searching for relevant papers...', { id: 'search' })
      
      const searchResults = await searchPapers(searchQuery, 10)
      setSelectedPapers(searchResults)
      
      toast.success(`Found ${searchResults.length} relevant papers`, { id: 'search' })

      // Step 2: Analyze each paper
      setCurrentStep(2)
      toast.loading('Analyzing papers with AI...', { id: 'analyze' })
      
      const analysisPromises = searchResults.map(async (paper, index) => {
        try {
          const [geminiAnalysis, deepseekAnalysis] = await Promise.allSettled([
            analyzePaper(paper.abstract || '', paper.title),
            analyzePaperWithDeepSeek(paper.abstract || '', paper.title)
          ])

          return {
            ...paper,
            analysis: {
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
              summary: deepseekAnalysis.value?.summary || geminiAnalysis.value?.summary
            }
          }
        } catch (error) {
          console.error(`Error analyzing paper ${index + 1}:`, error)
          return { ...paper, analysis: null }
        }
      })

      const analyzedPapers = await Promise.all(analysisPromises)
      toast.success('Analysis complete!', { id: 'analyze' })

      // Step 3: Generate synthesis
      setCurrentStep(3)
      toast.loading('Generating literature review...', { id: 'synthesis' })
      
      const synthesis = await generateLiteratureReview(analyzedPapers, searchQuery)
      setGeneratedReview(synthesis)
      
      toast.success('Literature review generated!', { id: 'synthesis' })

    } catch (error) {
      console.error('Error generating literature review:', error)
      toast.error(`Failed to generate literature review: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateLiteratureReview = async (papers, topic) => {
    // Combine all summaries and topics
    const allSummaries = papers
      .filter(p => p.analysis?.summary)
      .map(p => `${p.title}: ${p.analysis.summary}`)
      .join('\n\n')

    const allTopics = [...new Set(
      papers
        .filter(p => p.analysis?.keyTopics)
        .flatMap(p => p.analysis.keyTopics)
    )]

    const allGaps = [...new Set(
      papers
        .filter(p => p.analysis?.researchGaps)
        .flatMap(p => p.analysis.researchGaps)
    )]

    // Create synthesis prompt
    const synthesisPrompt = `
    Based on the following research papers about "${topic}", generate a comprehensive literature review that includes:

    1. Executive Summary (2-3 paragraphs)
    2. Key Research Themes (identify 3-5 main themes)
    3. Research Evolution Timeline (how the field has developed)
    4. Common Research Gaps (areas needing more research)
    5. Future Research Directions (suggestions for next steps)
    6. Methodology Trends (common approaches used)

    Papers analyzed:
    ${allSummaries}

    Key topics identified: ${allTopics.join(', ')}
    Research gaps: ${allGaps.join(', ')}
    `

    try {
      const synthesis = await analyzePaper(synthesisPrompt, `Literature Review: ${topic}`)
      return {
        topic,
        papers: papers.filter(p => p.analysis),
        synthesis,
        stats: {
          totalPapers: papers.length,
          analyzedPapers: papers.filter(p => p.analysis).length,
          totalCitations: papers.reduce((sum, p) => sum + (p.citationCount || 0), 0),
          dateRange: {
            earliest: Math.min(...papers.map(p => p.year || new Date().getFullYear())),
            latest: Math.max(...papers.map(p => p.year || new Date().getFullYear()))
          }
        }
      }
    } catch (error) {
      throw new Error('Failed to generate synthesis')
    }
  }

  const steps = [
    { icon: Search, label: 'Searching Papers', description: 'Finding relevant papers on your topic' },
    { icon: Brain, label: 'AI Analysis', description: 'Analyzing each paper with advanced AI' },
    { icon: Network, label: 'Synthesis', description: 'Generating comprehensive literature review' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-poppins-bold text-gray-900 dark:text-white mb-6">
              Literature Review Generator
            </h1>
            <p className="text-xl font-poppins-medium text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Enter a research topic and get a comprehensive literature review with AI-powered analysis of the most relevant papers.
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
                  <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-poppins-semibold text-gray-900 dark:text-white mb-1">What is a Literature Review?</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    A structured synthesis of research on a topic. ManthanAI helps you find key themes, trace how the field evolved, reveal common gaps, and suggest future directions—quickly and clearly.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: Brain, title: 'AI Synthesis', desc: 'Executive summary, key themes, methods, and gaps distilled by advanced AI.' },
                { icon: Network, title: 'Connected Insights', desc: 'Surfaces relationships between papers and recurring patterns across work.' },
                { icon: TrendingUp, title: 'Evolution Over Time', desc: 'Highlights how ideas, methods, and impact changed across years.' },
              ].map(({ icon: Icon, title, desc }, i) => (
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
                  Enter Your Research Topic
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Be specific about your research area for better results
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., machine learning for natural language processing, blockchain in healthcare, quantum computing algorithms"
                    className="input-field pl-12 text-lg"
                    disabled={isGenerating}
                  />
                </div>

                <button
                  onClick={handleGenerateReview}
                  disabled={isGenerating || !searchQuery.trim()}
                  className="btn-primary w-full flex items-center justify-center space-x-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating Review...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Literature Review</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress Steps */}
              {isGenerating && (
                <div className="mt-8">
                  <div className="space-y-4">
                    {steps.map((step, index) => {
                      const Icon = step.icon
                      const isActive = index === currentStep
                      const isCompleted = index < currentStep

                      return (
                        <div 
                          key={index}
                          className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                            isActive 
                              ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                              : isCompleted
                              ? 'bg-green-50 dark:bg-green-900/20'
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-green-100 dark:bg-green-900' 
                              : isActive 
                              ? 'bg-blue-100 dark:bg-blue-900' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            {isCompleted ? (
                              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : isActive ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400"></div>
                            ) : (
                              <Icon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className={`font-poppins-medium ${
                              isActive 
                                ? 'text-blue-900 dark:text-blue-100' 
                                : isCompleted 
                                ? 'text-green-900 dark:text-green-100' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {step.label}
                            </h4>
                            <p className={`text-sm ${
                              isActive 
                                ? 'text-blue-700 dark:text-blue-300' 
                                : isCompleted 
                                ? 'text-green-700 dark:text-green-300' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {generatedReview && (
        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-poppins-bold text-gray-900 dark:text-white mb-4">
                  Literature Review: {generatedReview.topic}
                </h2>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>{generatedReview.stats.analyzedPapers} Papers Analyzed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{generatedReview.stats.totalCitations.toLocaleString()} Citations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{generatedReview.stats.dateRange.earliest} - {generatedReview.stats.dateRange.latest}</span>
                  </div>
                </div>
              </div>

              {/* Synthesis Results */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="card p-6">
                    <h3 className="text-xl font-poppins-semibold text-gray-900 dark:text-white mb-4">
                      Executive Summary
                    </h3>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="font-poppins-regular text-gray-700 dark:text-gray-300 leading-relaxed">
                        {generatedReview.synthesis.summary}
                      </p>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-xl font-poppins-semibold text-gray-900 dark:text-white mb-4">
                      Key Research Themes
                    </h3>
                    <div className="space-y-3">
                      {generatedReview.synthesis.keyTopics?.map((topic, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-poppins-medium text-gray-900 dark:text-white">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-xl font-poppins-semibold text-gray-900 dark:text-white mb-4">
                      Research Gaps
                    </h3>
                    <div className="space-y-3">
                      {generatedReview.synthesis.researchGaps?.map((gap, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                          <span className="font-poppins-regular text-gray-700 dark:text-gray-300">{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <div className="card p-6">
                    <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white mb-4">
                      Analyzed Papers
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {generatedReview.papers.map((paper, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h4 className="font-poppins-medium text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {paper.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {paper.authors?.slice(0, 2).map(a => a.name).join(', ')}
                            {paper.authors?.length > 2 && ' et al.'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{paper.year}</span>
                            <span>{paper.citationCount || 0} citations</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <button className="btn-primary w-full flex items-center justify-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Export Review</span>
                    </button>
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

export default LiteratureReviewPage
