import fallbackSVG from '../../assets/manthanai-logo-fallback.svg'
import userLogo from '../../assets/manthanai-logo-fallback.svg.png'

function classForSize(size) {
  switch (size) {
    case 6: return 'w-6 h-6'
    case 8: return 'w-8 h-8'
    case 10: return 'w-10 h-10'
    case 12: return 'w-12 h-12'
    case 16: return 'w-16 h-16'
    case 20: return 'w-20 h-20'
    default: return 'w-8 h-8'
  }
}

export default function Logo({ size = 8, rounded = true, className = '', removeBg = true, threshold = 245 }) {
  const sizeCls = classForSize(size)
  const radius = rounded ? 'rounded-lg' : ''
  
  const handleLoad = (e) => {
    if (!removeBg) return
    const img = e?.currentTarget
    if (!img || img.dataset.bgProcessed) return
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      const w = img.naturalWidth
      const h = img.naturalHeight
      if (!w || !h) return
      canvas.width = w
      canvas.height = h
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, w, h)
      const data = imageData.data
      // Remove near-white / light-gray background
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        // If pixel is very light and close to neutral (background), make it transparent
        if (r >= threshold && g >= threshold && b >= threshold) {
          data[i + 3] = 0
        }
      }
      ctx.putImageData(imageData, 0, 0)
      const url = canvas.toDataURL('image/png')
      img.dataset.bgProcessed = '1'
      img.src = url
    } catch (_) {
      // Ignore processing errors silently
    }
  }
  return (
    <img
      src={userLogo}
      alt="ManthanAI logo"
      className={`${sizeCls} ${radius} object-contain ${className}`}
      crossOrigin="anonymous"
      onLoad={handleLoad}
      onError={(e) => {
        if (!e?.currentTarget) return
        const img = e.currentTarget
        // First fallback: try public PNG if user's asset fails
        if (!img.dataset.triedPublic) {
          img.dataset.triedPublic = '1'
          img.src = '/manthanai-logo.png'
          return
        }
        // Final fallback: bundled SVG
        img.onerror = null
        img.src = fallbackSVG
      }}
    />
  )
}
