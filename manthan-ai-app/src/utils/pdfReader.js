// PDF text extraction utility using pdfjs-dist
import * as pdfjsLib from 'pdfjs-dist'

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

/**
 * Extract text from PDF file
 * @param {File} file - The PDF file
 * @returns {Promise<string>} Extracted text content
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      // Combine all text items
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ')
      
      fullText += pageText + '\n\n'
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.')
  }
}

/**
 * Extract metadata from PDF file
 * @param {File} file - The PDF file
 * @returns {Promise<Object>} PDF metadata
 */
export async function extractPDFMetadata(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    const metadata = await pdf.getMetadata()
    
    return {
      title: metadata.info?.Title || 'Untitled',
      author: metadata.info?.Author || 'Unknown',
      subject: metadata.info?.Subject || '',
      creator: metadata.info?.Creator || '',
      producer: metadata.info?.Producer || '',
      creationDate: metadata.info?.CreationDate || '',
      modificationDate: metadata.info?.ModDate || '',
      pageCount: pdf.numPages
    }
  } catch (error) {
    console.error('Error extracting PDF metadata:', error)
    return {
      title: 'Untitled',
      author: 'Unknown',
      subject: '',
      creator: '',
      producer: '',
      creationDate: '',
      modificationDate: '',
      pageCount: 0
    }
  }
}

/**
 * Validate if file is a PDF
 * @param {File} file - The file to validate
 * @returns {boolean} True if file is a PDF
 */
export function isPDFFile(file) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
