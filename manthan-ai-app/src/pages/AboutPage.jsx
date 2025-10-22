import { Brain, Network, Lightbulb, Users, Target, Zap, Linkedin, Github } from 'lucide-react'

function AboutPage() {
  const teamMembers = [
    {
      name: "Rohan Patel",
      role: "Co‑developer",
      bio: "Product-focused engineer shaping ManthanAI’s UX, semantic pipelines, and client architecture.",
      image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=face",
      linkedin: "https://www.linkedin.com/in/rohan-patel",
      github: "https://github.com/rohan-patel"
    },
    {
      name: "Hardik Patel",
      role: "Co‑developer",
      bio: "Platform engineer driving AI model integration, backend services, and performance engineering.",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
      linkedin: "https://www.linkedin.com/in/hardik-patel",
      github: "https://github.com/hardik571"
    }
  ]

  const values = [
    {
      icon: Brain,
      title: "Innovation",
      description: "Pushing the boundaries of AI-powered research analysis"
    },
    {
      icon: Network,
      title: "Collaboration",
      description: "Building bridges between researchers and ideas"
    },
    {
      icon: Lightbulb,
      title: "Discovery",
      description: "Uncovering hidden connections in research"
    }
  ]

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-14 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About ManthanAI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              We're revolutionizing how researchers discover, analyze, and connect with academic knowledge through the power of artificial intelligence.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>10,000+ Researchers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>50,000+ Papers Analyzed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-10 animate-slide-up">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              To democratize access to research insights and accelerate scientific discovery by making complex academic networks understandable and actionable for researchers worldwide.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="text-center p-6 card-hover animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Developers Section */}
      <div className="py-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-slide-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Developers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The builders behind ManthanAI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center p-6 card-hover animate-fade-in" style={{ animationDelay: `${index * 90}ms` }}>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {member.bio}
                </p>
                <div className="flex items-center justify-center gap-4">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      aria-label={`LinkedIn profile of ${member.name}`}
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      aria-label={`GitHub profile of ${member.name}`}
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-20 animate-slide-up">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Powered by Advanced AI
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our platform leverages cutting-edge artificial intelligence to provide unprecedented insights into research networks.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Advanced AI Models
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Google Gemini 1.5 Pro</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Latest multimodal AI for comprehensive paper analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">DeepSeek AI</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Specialized research analysis and gap identification</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Semantic Scholar API</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Comprehensive academic database integration</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 animate-fade-in">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-700 to-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    AI-Powered Insights
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our AI models analyze millions of research papers to identify patterns, connections, and opportunities that would be impossible to discover manually.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-10 bg-gradient-to-r from-primary-700 to-primary-500 animate-fade-in">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Research?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of researchers who are already discovering new insights with ManthanAI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Analyzing
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
