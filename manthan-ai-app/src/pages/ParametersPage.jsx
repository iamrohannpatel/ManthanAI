import { Brain, Database, Zap, Shield, Globe, Cpu } from 'lucide-react'

function ParametersPage() {
  const aiModels = [
    {
      name: "Google Gemini 1.5 Pro",
      description: "Our primary AI model for comprehensive paper analysis",
      capabilities: [
        "Multimodal text understanding",
        "Advanced reasoning capabilities",
        "Context-aware analysis",
        "Cross-domain knowledge synthesis"
      ],
      icon: Brain,
      color: "blue"
    },
    {
      name: "DeepSeek AI",
      description: "Specialized model for research gap identification",
      capabilities: [
        "Research gap detection",
        "Methodology analysis",
        "Future work suggestions",
        "Technical depth assessment"
      ],
      icon: Cpu,
      color: "green"
    }
  ]

  const dataSources = [
    {
      name: "Semantic Scholar",
      description: "Comprehensive academic database",
      features: [
        "200M+ research papers",
        "Citation networks",
        "Author information",
        "Abstract and metadata"
      ],
      icon: Database,
      color: "purple"
    },
    {
      name: "CrossRef",
      description: "DOI resolution and metadata",
      features: [
        "DOI resolution",
        "Publication metadata",
        "Author affiliations",
        "Journal information"
      ],
      icon: Globe,
      color: "orange"
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Technology & Parameters
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Understanding the advanced AI models and data sources that power ReSeer's research analysis capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* AI Models Section */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              AI Models
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We use state-of-the-art AI models to provide comprehensive analysis of your research papers.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {aiModels.map((model, index) => {
              const Icon = model.icon
              return (
                <div key={index} className="card p-8 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getColorClasses(model.color)}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {model.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {model.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Key Capabilities:
                    </h4>
                    {model.capabilities.map((capability, capIndex) => (
                      <div key={capIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-300">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Data Sources Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Data Sources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform integrates with leading academic databases to provide comprehensive research insights.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {dataSources.map((source, index) => {
              const Icon = source.icon
              return (
                <div key={index} className="card p-8 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getColorClasses(source.color)}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {source.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {source.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Features:
                    </h4>
                    {source.features.map((feature, featIndex) => (
                      <div key={featIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Analysis Parameters */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Analysis Parameters
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Customizable parameters that control the depth and focus of your research analysis.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Analysis Depth
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Quick Analysis</span>
                    <span className="text-gray-400 dark:text-gray-500">~30 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Standard Analysis</span>
                    <span className="text-gray-400 dark:text-gray-500">~2 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Deep Analysis</span>
                    <span className="text-gray-400 dark:text-gray-500">~5 minutes</span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Privacy & Security
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">End-to-end encryption</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">No data retention</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">GDPR compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Technical Specifications
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Detailed technical information about our platform's capabilities and limitations.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Processing Speed
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Up to 10,000 words per minute with our optimized AI pipeline
                </p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Accuracy Rate
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  95%+ accuracy in key topic identification and gap analysis
                </p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Language Support
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Support for 50+ languages with automatic translation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Advanced AI Analysis?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Try our platform and see how our advanced AI models can transform your research workflow.
          </p>
          <a
            href="/"
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Start Your Analysis
          </a>
        </div>
      </div>
    </div>
  )
}

export default ParametersPage
