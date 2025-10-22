import { useAuth } from '../../context/AuthContext'
import { BarChart3, FileText, TrendingUp, Calendar } from 'lucide-react'

function DashboardHeader({ savedPapers = [], totalCitations = 0, recentActivity = 0 }) {
  const { currentUser } = useAuth()

  const stats = [
    {
      icon: FileText,
      label: 'Saved Papers',
      value: savedPapers.length,
      color: 'blue'
    },
    {
      icon: TrendingUp,
      label: 'Total Citations',
      value: totalCitations.toLocaleString(),
      color: 'green'
    },
    {
      icon: Calendar,
      label: 'Recent Activity',
      value: recentActivity,
      color: 'purple'
    }
  ]

  return (
    <div className="mb-8">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Researcher'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Here's what's happening with your research insights.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
            green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
            purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
          }

          return (
            <div key={index} className="card-hover p-6 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="btn-primary flex items-center space-x-2">
          <BarChart3 className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
        <button className="btn-outline flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Import Papers</span>
        </button>
        <button className="btn-outline flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span>View Trends</span>
        </button>
      </div>
    </div>
  )
}

export default DashboardHeader
