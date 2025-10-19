function SavedPaperCard({ paper, isSelected, onClick }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
      }`}
    >
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
          {paper.title}
        </h3>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p className="line-clamp-1">
            {paper.authors}
          </p>
          <div className="flex items-center justify-between">
            <span>{paper.year}</span>
            {paper.citationCount && (
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{paper.citationCount}</span>
              </span>
            )}
          </div>
        </div>

        {paper.summary && (
          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
            {paper.summary}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{formatDate(paper.createdAt)}</span>
          <span className="capitalize">{paper.source}</span>
        </div>

        {/* Key Topics Preview */}
        {paper.keyTopics && paper.keyTopics.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {paper.keyTopics.slice(0, 3).map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
              >
                {topic}
              </span>
            ))}
            {paper.keyTopics.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                +{paper.keyTopics.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedPaperCard
