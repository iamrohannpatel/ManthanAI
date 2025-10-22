export function H1({ className = '', children }) {
  return <h1 className={`text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white ${className}`}>{children}</h1>
}

export function H2({ className = '', children }) {
  return <h2 className={`text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white ${className}`}>{children}</h2>
}

export function H3({ className = '', children }) {
  return <h3 className={`text-xl md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white ${className}`}>{children}</h3>
}

export function Subtle({ className = '', children }) {
  return <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>{children}</p>
}

export function Lead({ className = '', children }) {
  return <p className={`text-base md:text-lg text-gray-700 dark:text-gray-300 ${className}`}>{children}</p>
}

export default { H1, H2, H3, Subtle, Lead }
