import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Sun, Moon, Home, Info, Settings, Mail, BookOpen, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const { isDark, toggle } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/60 border-b border-gray-200/70 dark:border-gray-800/70 shadow-[0_6px_30px_-12px_rgba(0,0,0,0.2)]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 blur opacity-40 group-hover:opacity-60 transition" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary-700 to-primary-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-md">
                <span className="text-white font-bold text-sm">M</span>
              </div>
            </div>
            <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              ManthanAI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Desktop Navigation Links */}
            {[ 
              { to: '/', label: 'Home', Icon: Home },
              { to: '/parameters', label: 'Technology', Icon: Settings },
              { to: '/literature-review', label: 'Literature Review', Icon: BookOpen },
              { to: '/author-explorer', label: 'Author Explorer', Icon: User },
              { to: '/about', label: 'About', Icon: Info },
              { to: '/contact', label: 'Contact', Icon: Mail },
            ].map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive(to)
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
                {/* Active underline */}
                <span
                  className={`absolute left-2 right-2 -bottom-[2px] h-0.5 rounded-full transition-all duration-300 origin-left ${
                    isActive(to)
                      ? 'bg-primary-500 scale-x-100'
                      : 'bg-transparent group-hover:bg-primary-200 dark:group-hover:bg-primary-800 scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 animate-slide-up">
            <div className="space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/parameters" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/parameters') 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Technology</span>
              </Link>
              <Link 
                to="/literature-review" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/literature-review') 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Literature Review</span>
              </Link>
              <Link 
                to="/author-explorer" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/author-explorer') 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Author Explorer</span>
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/about') 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Info className="w-5 h-5" />
                <span>About</span>
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/contact') 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </Link>
              
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
