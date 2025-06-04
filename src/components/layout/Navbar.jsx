import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  User, 
  Sun, 
  Moon,
  MapPin,
  Phone,
  Heart,
  LogOut,
  Settings
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useWishlist } from '../../context/WishlistContext'
import { debounce } from '../../utils/helpers'
import ApiConfigPanel from '../ui/ApiConfigPanel'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  
  const location = useLocation()
  const navigate = useNavigate()
  const { getItemCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { getWishlistStats } = useWishlist()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = debounce(() => {
      setIsScrolled(window.scrollY > 20)
    }, 100)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setIsSearchOpen(false)
    setIsProfileOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gin', path: '/products/gin' },
    { name: 'Whisky', path: '/products/whisky' },
    { name: 'Wine', path: '/products/wine' },
    { name: 'Spirits', path: '/products/spirits' },
    { name: 'About', path: '/about' },
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-effect shadow-apple dark:shadow-apple-dark'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Top bar with contact info */}
      <div className="hidden lg:block bg-platypus-green-500 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+254 712 345 678</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={14} />
              <span>Free delivery in Nakuru on orders above KES 2,500</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Follow us for exclusive offers</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-platypus-green-500 to-platypus-gold-400 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-platypus-green-500 dark:text-white">
                Platypus
              </span>
              <span className="block text-xs text-apple-gray-600 dark:text-apple-gray-400 -mt-1">
                Liquor Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-medium transition-colors duration-300 hover:text-platypus-green-500 dark:hover:text-platypus-gold-400 ${
                  location.pathname === link.path
                    ? 'text-platypus-green-500 dark:text-platypus-gold-400'
                    : 'text-apple-gray-700 dark:text-apple-gray-300'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-platypus-green-500 dark:bg-platypus-gold-400"
                    layoutId="navbar-indicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-apple-gray-700 dark:text-apple-gray-300 hover:text-platypus-green-500 dark:hover:text-platypus-gold-400 transition-colors focus-ring rounded-lg"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-apple-gray-700 dark:text-apple-gray-300 hover:text-platypus-green-500 dark:hover:text-platypus-gold-400 transition-colors focus-ring rounded-lg"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* API Configuration (Development) */}
            {import.meta.env.DEV && (
              <button
                onClick={() => setIsConfigOpen(true)}
                className="p-2 text-apple-gray-700 dark:text-apple-gray-300 hover:text-platypus-green-500 dark:hover:text-platypus-gold-400 transition-colors focus-ring rounded-lg"
                aria-label="API Configuration"
                title="API Configuration"
              >
                <Settings size={20} />
              </button>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-apple-gray-700 dark:text-apple-gray-300 hover:text-platypus-green-500 dark:hover:text-platypus-gold-400 transition-colors focus-ring rounded-lg"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {getWishlistStats().totalItems > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium min-w-[18px] h-[18px] rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {getWishlistStats().totalItems}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-apple-gray-700 dark:text-apple-gray-300 hover:text-platypus-green-500 dark:hover:text-platypus-gold-400 transition-colors focus-ring rounded-lg"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              {getItemCount() > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-platypus-gold-400 text-white text-xs font-medium min-w-[18px] h-[18px] rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {getItemCount()}
                </motion.span>
              )}
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 text-apple-gray-700 dark:text-apple-gray-300 hover:text-platypus-green-500 dark:hover:text-platypus-gold-400 transition-colors focus-ring rounded-lg"
                aria-label="User menu"
              >
                <User size={20} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 card py-2 shadow-lg"
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-apple-gray-200 dark:border-apple-gray-700">
                          <p className="font-medium text-apple-gray-900 dark:text-apple-gray-100">
                            {user?.name}
                          </p>
                          <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
                        >
                          <User size={16} className="mr-3" />
                          My Profile
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center px-4 py-2 text-sm text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
                        >
                          <Heart size={16} className="mr-3" />
                          My Wishlist
                          {getWishlistStats().totalItems > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {getWishlistStats().totalItems}
                            </span>
                          )}
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
                        >
                          <ShoppingCart size={16} className="mr-3" />
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-apple-gray-700 dark:text-apple-gray-300 hover:text-platypus-green-500 dark:hover:text-platypus-gold-400 transition-colors focus-ring rounded-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-effect border-t border-apple-gray-200 dark:border-apple-gray-700"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for gin, whisky, wine..."
                    className="w-full px-4 py-3 pr-12 text-apple-gray-900 dark:text-apple-gray-100 bg-white dark:bg-apple-gray-800 border border-apple-gray-300 dark:border-apple-gray-600 rounded-xl focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent transition-colors"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-apple-gray-500 hover:text-platypus-green-500 transition-colors"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-effect border-t border-apple-gray-200 dark:border-apple-gray-700"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-platypus-green-100 dark:bg-platypus-green-900/30 text-platypus-green-600 dark:text-platypus-green-400'
                        : 'text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Configuration Panel */}
      <ApiConfigPanel
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </motion.header>
  )
}

export default Navbar
