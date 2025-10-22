import Navbar from '../Navbar'
import Footer from '../common/Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen gradient-bg text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
      <header>
        <Navbar />
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}
