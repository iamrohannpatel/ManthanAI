import { useState } from 'react'
import { Search, Filter, SortAsc, SortDesc, Calendar, TrendingUp } from 'lucide-react'

function SearchAndFilterBar({ onSearch, onFilter, onSort, searchQuery = '', sortBy = 'date', sortOrder = 'desc' }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: 'all',
    citationCount: 'all',
    topic: 'all'
  })

  const sortOptions = [
    { value: 'date', label: 'Date Added', icon: Calendar },
    { value: 'citations', label: 'Citation Count', icon: TrendingUp },
    { value: 'title', label: 'Title', icon: SortAsc }
  ]

  const handleSearch = (e) => {
    onSearch(e.target.value)
  }

  const handleSort = (sortBy, sortOrder) => {
    onSort(sortBy, sortOrder)
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search papers by title, author, or keyword..."
              value={searchQuery}
              onChange={handleSearch}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value, sortOrder)}
            className="input-field w-auto"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleSort(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`btn-outline flex items-center space-x-2 ${
            isFilterOpen ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : ''
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Added
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="input-field"
              >
                <option value="all">All Time</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
              </select>
            </div>

            {/* Citation Count Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Citation Count
              </label>
              <select
                value={filters.citationCount}
                onChange={(e) => handleFilterChange('citationCount', e.target.value)}
                className="input-field"
              >
                <option value="all">Any</option>
                <option value="high">100+ Citations</option>
                <option value="medium">10-100 Citations</option>
                <option value="low">0-10 Citations</option>
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic
              </label>
              <select
                value={filters.topic}
                onChange={(e) => handleFilterChange('topic', e.target.value)}
                className="input-field"
              >
                <option value="all">All Topics</option>
                <option value="ai">Artificial Intelligence</option>
                <option value="ml">Machine Learning</option>
                <option value="nlp">Natural Language Processing</option>
                <option value="cv">Computer Vision</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilters({ dateRange: 'all', citationCount: 'all', topic: 'all' })
                onFilter({ dateRange: 'all', citationCount: 'all', topic: 'all' })
              }}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchAndFilterBar
