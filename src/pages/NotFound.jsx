import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HomeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-16 text-center min-h-screen flex items-center justify-center"
    >
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-platypus-green mb-4">404</h1>
          <h2 className="text-3xl font-bold text-apple-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-apple-gray-600 dark:text-apple-gray-300 mb-8">
            Sorry, the page you're looking for doesn't exist. It may have been moved or deleted.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-platypus-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-platypus-green/90 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 border border-platypus-green text-platypus-green px-6 py-3 rounded-xl font-semibold hover:bg-platypus-green/5 transition-colors"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            <span>Shop Now</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default NotFound
