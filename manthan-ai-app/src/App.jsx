import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ParametersPage from './pages/ParametersPage'
import AuthorExplorerPage from './pages/AuthorExplorerPage'
import LiteratureReviewPage from './pages/LiteratureReviewPage'
import LearnMorePage from './pages/LearnMorePage'

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
)

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              There was an error loading the application. Please check the console for details.
            </p>
            {this.state.error && (
              <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                <summary className="cursor-pointer font-semibold">Error Details</summary>
                <pre className="text-sm text-gray-700 dark:text-gray-300 mt-2 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/learn-more" element={<LearnMorePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/parameters" element={<ParametersPage />} />
                  <Route path="/authors" element={<AuthorExplorerPage />} />
                  <Route path="/author-explorer" element={<AuthorExplorerPage />} />
                  <Route path="/literature-review" element={<LiteratureReviewPage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#10B981',
                    },
                  },
                  error: {
                    style: {
                      background: '#EF4444',
                    },
                  },
                }}
              />
            </Layout>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App