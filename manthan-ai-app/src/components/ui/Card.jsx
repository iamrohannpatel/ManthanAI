export default function Card({ as: Tag = 'div', className = '', children, padded = true, hover = false, interactive = false, variant = 'default' }) {
  const base = 'rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  const padding = padded ? 'p-6' : ''
  const hoverCls = hover ? 'hover:shadow-xl hover:scale-[1.01]' : ''
  const interactiveCls = interactive ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600 focus:ring-offset-2' : ''
  const variants = {
    default: '',
    elevated: 'shadow-lg',
    outline: 'border-2 border-gray-300 dark:border-gray-600',
  }

  return (
    <Tag className={`${base} ${variants[variant] || ''} ${padding} ${hoverCls} ${interactiveCls} ${className}`}>
      {children}
    </Tag>
  )
}
