import { useState } from 'react'
import { ZoomIn, ZoomOut, RotateCcw, Filter, Settings, Maximize2, Minimize2 } from 'lucide-react'

function GraphControls({ 
  onZoomIn, 
  onZoomOut, 
  onReset, 
  onFilter, 
  onSettings, 
  onFullscreen,
  isFullscreen = false,
  zoomLevel = 1,
  nodeCount = 0,
  edgeCount = 0
}) {
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    nodeSize: 5,
    edgeWidth: 2,
    showLabels: true,
    showEdges: true,
    layout: 'force'
  })

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettings?.(newSettings)
  }

  return (
    <div className="card p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Main Controls */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onZoomIn}
            className="btn-outline flex items-center space-x-1 px-3 py-2"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Zoom In</span>
          </button>
          
          <button
            onClick={onZoomOut}
            className="btn-outline flex items-center space-x-1 px-3 py-2"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
            <span>Zoom Out</span>
          </button>
          
          <button
            onClick={onReset}
            className="btn-outline flex items-center space-x-1 px-3 py-2"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-outline flex items-center space-x-1 px-3 py-2"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          
          <button
            onClick={onFullscreen}
            className="btn-outline flex items-center space-x-1 px-3 py-2"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
            <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{nodeCount} Papers</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{edgeCount} Connections</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Node Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Node Size
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.nodeSize}
                onChange={(e) => handleSettingChange('nodeSize', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {settings.nodeSize}
              </div>
            </div>

            {/* Edge Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Edge Width
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={settings.edgeWidth}
                onChange={(e) => handleSettingChange('edgeWidth', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {settings.edgeWidth}
              </div>
            </div>

            {/* Layout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Layout
              </label>
              <select
                value={settings.layout}
                onChange={(e) => handleSettingChange('layout', e.target.value)}
                className="input-field text-sm"
              >
                <option value="force">Force Directed</option>
                <option value="circular">Circular</option>
                <option value="hierarchical">Hierarchical</option>
                <option value="grid">Grid</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.showLabels}
                  onChange={(e) => handleSettingChange('showLabels', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Show Labels</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.showEdges}
                  onChange={(e) => handleSettingChange('showEdges', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Show Edges</span>
              </label>
            </div>
          </div>

          {/* Preset Layouts */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Layouts
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSettingChange('layout', 'force')}
                className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Force Directed
              </button>
              <button
                onClick={() => handleSettingChange('layout', 'circular')}
                className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                Circular
              </button>
              <button
                onClick={() => handleSettingChange('layout', 'hierarchical')}
                className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              >
                Hierarchical
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GraphControls
