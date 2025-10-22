import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Loader2, FileText, Brain, Network } from 'lucide-react'

function AnalysisStatus({ isAnalyzing, error, currentStep = 0, totalSteps = 3 }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 500)

      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [isAnalyzing])

  const steps = [
    { icon: FileText, label: 'Extracting Text', description: 'Reading and processing your document' },
    { icon: Brain, label: 'AI Analysis', description: 'Generating insights and summaries' },
    { icon: Network, label: 'Building Network', description: 'Creating citation visualization' }
  ]

  if (error) {
    return (
      <div className="card max-w-2xl mx-auto animate-slide-up">
        <div className="flex items-center space-x-4 p-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Analysis Failed
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {error.message || 'Something went wrong during analysis. Please try again.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAnalyzing) return null

  return (
    <div className="card max-w-2xl mx-auto animate-slide-up">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-spin" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Analyzing Your Paper
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              This may take a few moments...
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-600 to-primary-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const Icon = step.icon

            return (
              <div 
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' 
                    : isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-green-100 dark:bg-green-900' 
                  : isActive 
                    ? 'bg-primary-100 dark:bg-primary-900' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-primary-600 dark:text-primary-400 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    isActive 
                      ? 'text-primary-900 dark:text-primary-100' 
                      : isCompleted 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.label}
                  </h4>
                  <p className={`text-sm ${
                    isActive 
                      ? 'text-primary-700 dark:text-primary-300' 
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

        {/* Tips */}
        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-2">
            💡 Pro Tip
          </h4>
          <p className="text-sm text-primary-700 dark:text-primary-300">
            While we analyze your paper, you can explore other research papers or check out our dashboard for saved insights.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AnalysisStatus
