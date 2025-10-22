import { useState, useRef } from 'react'
import { extractTextFromPDF, extractPDFMetadata, isPDFFile, formatFileSize } from '../utils/pdfReader'
import toast from 'react-hot-toast'
import { Upload, FileText, Link, Hash, Sparkles, X, CheckCircle, AlertCircle } from 'lucide-react'

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
    <div className="card max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-700 to-primary-400 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analyze Research Paper
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Upload a PDF, enter a DOI, or provide an ArXiv ID to get AI-powered insights
        </p>
      </div>

      {/* Input Type Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => { setInputType('pdf'); resetForm() }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              inputType === 'pdf'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm transform scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PDF Upload</span>
          </button>
          <button
            onClick={() => { setInputType('doi'); resetForm() }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              inputType === 'doi'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm transform scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>DOI</span>
          </button>
          <button
            onClick={() => { setInputType('arxiv'); resetForm() }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              inputType === 'arxiv'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm transform scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>ArXiv ID</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        {inputType === 'pdf' && (
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105 shadow-lg'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
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
              <div className="space-y-6 animate-bounce-in">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mx-auto px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Remove file</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    Drop your PDF here, or click to browse
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Supports PDF files up to 10MB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary flex items-center space-x-2 mx-auto hover:scale-105 transition-transform duration-200"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose File</span>
                </button>
              </div>
            )}
          </div>
        )}

        {inputType === 'doi' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Link className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <label className="text-lg font-semibold text-gray-900 dark:text-white">
                DOI (Digital Object Identifier)
              </label>
            </div>
            <input
              type="text"
              value={doiInput}
              onChange={(e) => setDoiInput(e.target.value)}
              placeholder="e.g., 10.1038/nature12373"
              className="input-field text-lg"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>Enter the DOI of the paper you want to analyze</span>
            </p>
          </div>
        )}

        {inputType === 'arxiv' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Hash className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <label className="text-lg font-semibold text-gray-900 dark:text-white">
                ArXiv ID
              </label>
            </div>
            <input
              type="text"
              value={arxivInput}
              onChange={(e) => setArxivInput(e.target.value)}
              placeholder="e.g., 2301.00001 or cs.AI/2301.00001"
              className="input-field text-lg"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>Enter the ArXiv ID of the paper you want to analyze</span>
            </p>
          </div>
        )}

        {/* Analyze Button */}
        <div className="text-center pt-6">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (inputType === 'pdf' && !uploadedFile) || (inputType === 'doi' && !doiInput.trim()) || (inputType === 'arxiv' && !arxivInput.trim())}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto text-lg px-8 py-4 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
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
