import { useState, useRef } from 'react'
import { extractTextFromPDF, extractPDFMetadata, isPDFFile, formatFileSize } from '../utils/pdfReader'
import toast from 'react-hot-toast'

function UploadBox({ onAnalyze, isAnalyzing }) {
  const [inputType, setInputType] = useState('pdf')
  const [doiInput, setDoiInput] = useState('')
  const [arxivInput, setArxivInput] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = async (file) => {
    if (!isPDFFile(file)) {
      toast.error('Please upload a valid PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB')
      return
    }

    setUploadedFile(file)
    toast.success(`File "${file.name}" ready for analysis`)
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (isAnalyzing) return

    try {
      if (inputType === 'pdf' && uploadedFile) {
        const [text, metadata] = await Promise.all([
          extractTextFromPDF(uploadedFile),
          extractPDFMetadata(uploadedFile)
        ])
        
        onAnalyze({
          type: 'pdf',
          text,
          metadata,
          fileName: uploadedFile.name
        })
      } else if (inputType === 'doi' && doiInput.trim()) {
        onAnalyze({
          type: 'doi',
          value: doiInput.trim()
        })
      } else if (inputType === 'arxiv' && arxivInput.trim()) {
        onAnalyze({
          type: 'arxiv',
          value: arxivInput.trim()
        })
      } else {
        toast.error('Please provide valid input')
      }
    } catch (error) {
      toast.error(`Error processing input: ${error.message}`)
    }
  }

  const resetForm = () => {
    setUploadedFile(null)
    setDoiInput('')
    setArxivInput('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Analyze Research Paper
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Upload a PDF, enter a DOI, or provide an ArXiv ID to get AI-powered insights
        </p>
      </div>

      {/* Input Type Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => { setInputType('pdf'); resetForm() }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputType === 'pdf'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            PDF Upload
          </button>
          <button
            onClick={() => { setInputType('doi'); resetForm() }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputType === 'doi'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            DOI
          </button>
          <button
            onClick={() => { setInputType('arxiv'); resetForm() }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              inputType === 'arxiv'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ArXiv ID
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        {inputType === 'pdf' && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {uploadedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Drop your PDF here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports PDF files up to 10MB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                >
                  Choose File
                </button>
              </div>
            )}
          </div>
        )}

        {inputType === 'doi' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              DOI (Digital Object Identifier)
            </label>
            <input
              type="text"
              value={doiInput}
              onChange={(e) => setDoiInput(e.target.value)}
              placeholder="e.g., 10.1038/nature12373"
              className="input-field"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter the DOI of the paper you want to analyze
            </p>
          </div>
        )}

        {inputType === 'arxiv' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ArXiv ID
            </label>
            <input
              type="text"
              value={arxivInput}
              onChange={(e) => setArxivInput(e.target.value)}
              placeholder="e.g., 2301.00001 or cs.AI/2301.00001"
              className="input-field"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter the ArXiv ID of the paper you want to analyze
            </p>
          </div>
        )}

        {/* Analyze Button */}
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (inputType === 'pdf' && !uploadedFile) || (inputType === 'doi' && !doiInput.trim()) || (inputType === 'arxiv' && !arxivInput.trim())}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Analyze Paper</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadBox
