import { useState } from 'react'
import { X, FileText, TrendingUp, Users, Calendar, Brain, ArrowRight, CheckCircle } from 'lucide-react'
import { analyzePaper } from '../../utils/geminiAPI'
import { analyzePaperWithDeepSeek } from '../../utils/deepseekAPI'
import toast from 'react-hot-toast'

function ComparativeAnalysis({ selectedPapers, onClose, isOpen }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [comparison, setComparison] = useState(null)

  const handleCompare = async () => {
    if (selectedPapers.length < 2) {
      toast.error('Please select at least 2 papers to compare')
      return
    }

    setIsAnalyzing(true)
    setComparison(null)

    try {
      toast.loading('Analyzing papers for comparison...', { id: 'compare' })

      // Prepare paper summaries for comparison
      const paperSummaries = selectedPapers.map(paper => ({
        title: paper.title,
        authors: paper.authors?.map(a => a.name).join(', ') || 'Unknown',
        year: paper.year,
        summary: paper.analysis?.summary || paper.abstract || 'No summary available',
        keyTopics: paper.analysis?.keyTopics || [],
        contributions: paper.analysis?.contributions || []
      }))

      // Create comparison prompt
      const comparisonPrompt = `
      Please provide a detailed comparative analysis of the following research papers:

      ${paperSummaries.map((paper, index) => `
      Paper ${index + 1}: "${paper.title}"
      Authors: ${paper.authors}
      Year: ${paper.year}
      Summary: ${paper.summary}
      Key Topics: ${paper.keyTopics.join(', ')}
      Contributions: ${paper.contributions.join(', ')}
      `).join('\n---\n')}

      Please analyze and provide:
      1. **Similarities**: What common themes, methodologies, or findings do these papers share?
      2. **Differences**: What are the key differences in approach, scope, or conclusions?
      3. **Complementary Findings**: How do these papers complement each other?
      4. **Research Gaps**: What gaps or opportunities do these papers collectively reveal?
      5. **Synthesis**: How might these papers be combined or built upon for future research?
      6. **Timeline Analysis**: How has the research evolved across these papers (if applicable)?

      Provide a comprehensive analysis that would be valuable for researchers in this field.
      `

      // Get analysis from both AI models
      const [geminiAnalysis, deepseekAnalysis] = await Promise.allSettled([
        analyzePaper(comparisonPrompt, `Comparative Analysis: ${selectedPapers.length} Papers`),
        analyzePaperWithDeepSeek(comparisonPrompt, `Comparative Analysis: ${selectedPapers.length} Papers`)
      ])

      // Combine insights
      const combinedAnalysis = {
        similarities: [
          ...(geminiAnalysis.value?.similarities || []),
          ...(deepseekAnalysis.value?.similarities || [])
        ],
        differences: [
          ...(geminiAnalysis.value?.differences || []),
          ...(deepseekAnalysis.value?.differences || [])
        ],
        complementaryFindings: [
          ...(geminiAnalysis.value?.complementaryFindings || []),
          ...(deepseekAnalysis.value?.complementaryFindings || [])
        ],
        researchGaps: [
          ...(geminiAnalysis.value?.researchGaps || []),
          ...(deepseekAnalysis.value?.researchGaps || [])
        ],
        synthesis: deepseekAnalysis.value?.synthesis || geminiAnalysis.value?.synthesis,
        timelineAnalysis: deepseekAnalysis.value?.timelineAnalysis || geminiAnalysis.value?.timelineAnalysis
      }

      setComparison({
        papers: paperSummaries,
        analysis: combinedAnalysis,
        generatedAt: new Date().toISOString()
      })

      toast.success('Comparative analysis complete!', { id: 'compare' })

    } catch (error) {
      console.error('Error in comparative analysis:', error)
      toast.error(`Failed to generate comparison: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-poppins-bold text-gray-900 dark:text-white">
              Comparative Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Compare {selectedPapers.length} selected papers
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!comparison ? (
            <div className="space-y-6">
              {/* Selected Papers */}
              <div>
                <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white mb-4">
                  Selected Papers
                </h3>
                <div className="grid gap-4">
                  {selectedPapers.map((paper, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-poppins-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-poppins-medium text-gray-900 dark:text-white">
                          {paper.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {paper.authors?.map(a => a.name).join(', ')} • {paper.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {paper.citationCount || 0} citations
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Button */}
              <div className="text-center">
                <button
                  onClick={handleCompare}
                  disabled={isAnalyzing}
                  className="btn-primary flex items-center space-x-2 mx-auto text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      <span>Generate Comparative Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Analysis Results */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Similarities */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white">
                      Similarities
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {comparison.analysis.similarities?.map((similarity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span className="text-gray-700 dark:text-gray-300">{similarity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Differences */}
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white">
                      Differences
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {comparison.analysis.differences?.map((difference, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span className="text-gray-700 dark:text-gray-300">{difference}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Complementary Findings */}
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white">
                    Complementary Findings
                  </h3>
                </div>
                <div className="space-y-3">
                  {comparison.analysis.complementaryFindings?.map((finding, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span className="text-gray-700 dark:text-gray-300">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Gaps */}
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white">
                    Research Gaps & Opportunities
                  </h3>
                </div>
                <div className="space-y-3">
                  {comparison.analysis.researchGaps?.map((gap, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <span className="text-gray-700 dark:text-gray-300">{gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Synthesis */}
              {comparison.analysis.synthesis && (
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white">
                      Synthesis & Future Directions
                    </h3>
                  </div>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {comparison.analysis.synthesis}
                    </p>
                  </div>
                </div>
              )}

              {/* Timeline Analysis */}
              {comparison.analysis.timelineAnalysis && (
                <div className="card p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-poppins-semibold text-gray-900 dark:text-white">
                      Timeline Analysis
                    </h3>
                  </div>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {comparison.analysis.timelineAnalysis}
                    </p>
                  </div>
                </div>
              )}

              {/* Export Options */}
              <div className="flex justify-center space-x-4">
                <button className="btn-outline flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Export as PDF</span>
                </button>
                <button className="btn-outline flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Export as Markdown</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComparativeAnalysis
