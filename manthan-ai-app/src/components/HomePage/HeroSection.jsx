import { useAuth } from '../../context/AuthContext'
import { ArrowDown, Sparkles, Brain, Network, Lightbulb } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function HeroSection({ onScrollToAnalysis }) {
  const { currentUser, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="text-center mb-12 animate-fade-in">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-700 to-primary-400 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">M</span>
        </div>
      </div>
      
          <h1 className="text-6xl font-poppins-bold text-gradient mb-6 animate-bounce-in">
            ManthanAI
          </h1>
      
      <p className="text-xl font-poppins-medium text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto text-balance">
        Discover research insights intelligently with AI-powered analysis, 
        citation mapping, and cross-disciplinary connections.
      </p>
      
      {!currentUser && (
        <div className="glass-effect rounded-xl p-6 max-w-md mx-auto animate-slide-up mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              Sign in to save your research insights and build your personal knowledge base.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="relative group">
              <button
                onClick={async () => { try { await signInWithGoogle() } catch {} }}
                className="btn-primary px-5 py-2 text-sm"
                aria-label="Sign in to ManthanAI"
              >
                Sign In
              </button>
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="px-3 py-2 rounded-lg text-xs text-gray-800 dark:text-gray-100 bg-white/90 dark:bg-gray-800/90 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
                  Already have an account? Continue with Google to access your saved insights.
                </div>
              </div>
            </div>

            <div className="relative group">
              <button
                onClick={async () => { try { await signInWithGoogle() } catch {} }}
                className="btn-outline px-5 py-2 text-sm"
                aria-label="Create an account with ManthanAI"
              >
                Sign Up
              </button>
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="px-3 py-2 rounded-lg text-xs text-gray-800 dark:text-gray-100 bg-white/90 dark:bg-gray-800/90 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
                  New to ManthanAI? Create your account using Google in one click.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Features Preview */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
        <div className="flex items-center space-x-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Smart insights</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">Citation Maps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Visual networks</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">Research Gaps</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">New opportunities</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onScrollToAnalysis}
          className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Sparkles className="w-5 h-5" />
          <span>Start Analyzing</span>
        </button>
        
        <div className="relative group">
          <button
            onClick={() => window.open('/learn-more', '_blank', 'noopener,noreferrer')}
            className="btn-outline flex items-center space-x-2 text-lg px-8 py-4 hover:scale-105 transition-all duration-200"
            aria-label="Learn more about ManthanAI"
          >
            <ArrowDown className="w-5 h-5" />
            <span>Learn More</span>
          </button>
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-100 bg-white/90 dark:bg-gray-800/90 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
              Learn more about ManthanAI
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="mt-16 animate-bounce">
        <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
          <span className="text-sm">Scroll to explore</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}

export default HeroSection
