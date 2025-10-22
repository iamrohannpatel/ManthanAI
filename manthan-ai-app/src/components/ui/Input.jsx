import { forwardRef } from 'react'

const base = 'block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600 focus:border-transparent'

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-4 text-base',
}

export const Input = forwardRef(function Input({
  label,
  error,
  helperText,
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
  ...props
}, ref) {
  const sizeCls = sizes[size] || sizes.md
  const iconPaddingLeft = leftIcon ? 'pl-10' : ''
  const iconPaddingRight = rightIcon ? 'pr-10' : ''
  const border = error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600'

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {leftIcon}
          </span>
        )}
        <input ref={ref} className={`${base} ${sizeCls} ${iconPaddingLeft} ${iconPaddingRight} ${border}`} {...props} />
        {rightIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

export default Input
