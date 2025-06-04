import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  ShoppingCart, 
  Filter, 
  Search, 
  SortAsc,
  Grid,
  List,
  Trash2,
  Package,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('dateAdded')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStock, setFilterStock] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { 
    wishlistItems, 
    isLoading, 
    removeFromWishlist, 
    clearWishlist, 
    moveToCart,
    getWishlistStats,
    filterWishlist,
    sortWishlist
  } = useWishlist()
  
  const { addToCart } = useCart()

  const stats = getWishlistStats()

  // Get filtered and sorted items
  const filteredItems = filterWishlist({
    category: filterCategory,
    inStock: filterStock === 'all' ? undefined : filterStock === 'inStock',
    search: searchTerm
  })

  const handleSort = (newSortBy) => {
    const newOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc'
    setSortBy(newSortBy)
    setSortOrder(newOrder)
    sortWishlist(newSortBy, newOrder)
  }

  const handleMoveToCart = async (item) => {
    await moveToCart(item.id, addToCart)
  }

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      await clearWishlist()
    }
  }

  const categories = [...new Set(wishlistItems.map(item => item.category))]

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <section className="bg-gradient-to-br from-platypus-green-50 via-white to-platypus-gold-50 dark:from-apple-gray-950 dark:via-black dark:to-apple-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-apple-gray-600 dark:text-apple-gray-400 hover:text-platypus-green-600 dark:hover:text-platypus-green-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Heart className="w-12 h-12 text-platypus-green-600 dark:text-platypus-green-400" />
              <h1 className="text-4xl md:text-6xl font-bold text-apple-gray-900 dark:text-apple-gray-100">
                My Wishlist
              </h1>
            </div>
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 mb-8">
              {stats.isEmpty 
                ? "Your wishlist is empty. Start adding products you love!"
                : `${stats.totalItems} ${stats.totalItems === 1 ? 'item' : 'items'} saved for later`
              }
            </p>

            {!stats.isEmpty && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-apple-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-platypus-green-600 dark:text-platypus-green-400">
                    {stats.totalItems}
                  </div>
                  <div className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                    Total Items
                  </div>
                </div>
                <div className="bg-white dark:bg-apple-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.inStockItems}
                  </div>
                  <div className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                    In Stock
                  </div>
                </div>
                <div className="bg-white dark:bg-apple-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.outOfStockItems}
                  </div>
                  <div className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                    Out of Stock
                  </div>
                </div>
                <div className="bg-white dark:bg-apple-gray-800 rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-platypus-gold-600 dark:text-platypus-gold-400">
                    {formatPrice(stats.totalValue)}
                  </div>
                  <div className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                    Total Value
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {!stats.isEmpty && (
        <>
          {/* Controls */}
          <section className="py-8 bg-apple-gray-50 dark:bg-apple-gray-950 border-b border-apple-gray-200 dark:border-apple-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-apple-gray-400" />
                    <input
                      type="text"
                      placeholder="Search wishlist..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100"
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-4">
                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      showFilters
                        ? 'bg-platypus-green-100 dark:bg-platypus-green-900 border-platypus-green-300 dark:border-platypus-green-700 text-platypus-green-700 dark:text-platypus-green-300'
                        : 'bg-white dark:bg-apple-gray-800 border-apple-gray-300 dark:border-apple-gray-600 text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>

                  {/* Sort */}
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newOrder] = e.target.value.split('-')
                      handleSort(newSortBy)
                    }}
                    className="px-4 py-2 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 focus:ring-2 focus:ring-platypus-green-500"
                  >
                    <option value="dateAdded-desc">Newest First</option>
                    <option value="dateAdded-asc">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low to High</option>
                    <option value="price-desc">Price High to Low</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${
                        viewMode === 'grid'
                          ? 'bg-platypus-green-600 text-white'
                          : 'bg-white dark:bg-apple-gray-800 text-apple-gray-600 dark:text-apple-gray-400 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${
                        viewMode === 'list'
                          ? 'bg-platypus-green-600 text-white'
                          : 'bg-white dark:bg-apple-gray-800 text-apple-gray-600 dark:text-apple-gray-400 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Clear All */}
                  <button
                    onClick={handleClearWishlist}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-6 bg-white dark:bg-apple-gray-800 rounded-lg border border-apple-gray-200 dark:border-apple-gray-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 focus:ring-2 focus:ring-platypus-green-500"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-2">
                        Stock Status
                      </label>
                      <select
                        value={filterStock}
                        onChange={(e) => setFilterStock(e.target.value)}
                        className="w-full px-4 py-2 border border-apple-gray-300 dark:border-apple-gray-600 rounded-lg bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-apple-gray-100 focus:ring-2 focus:ring-platypus-green-500"
                      >
                        <option value="all">All Items</option>
                        <option value="inStock">In Stock Only</option>
                        <option value="outOfStock">Out of Stock Only</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setFilterCategory('all')
                          setFilterStock('all')
                          setSearchTerm('')
                        }}
                        className="w-full px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-700 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* Wishlist Items */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-apple-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2">
                    No items found
                  </h3>
                  <p className="text-apple-gray-600 dark:text-apple-gray-400">
                    Try adjusting your filters or search terms.
                  </p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                  : 'space-y-6'
                }>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={viewMode === 'grid' ? 'card p-6' : 'card p-6 flex items-center space-x-6'}
                    >
                      {/* Product Image */}
                      <div className={viewMode === 'grid' ? 'mb-4' : 'flex-shrink-0'}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`${viewMode === 'grid' ? 'w-full h-48' : 'w-24 h-24'} object-cover rounded-lg`}
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <span className="text-white font-semibold">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className={viewMode === 'grid' ? '' : 'flex-1'}>
                        <div className={viewMode === 'grid' ? 'mb-4' : 'mb-2'}>
                          <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                            {item.brand} • {item.category}
                          </p>
                        </div>

                        <div className={`flex items-center justify-between ${viewMode === 'grid' ? 'mb-4' : 'mb-2'}`}>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-apple-gray-900 dark:text-apple-gray-100">
                              {formatPrice(item.price)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-sm text-apple-gray-500 dark:text-apple-gray-400 line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>
                          {!item.inStock && (
                            <div className="flex items-center text-red-600 dark:text-red-400">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm">Out of Stock</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className={`flex ${viewMode === 'grid' ? 'flex-col space-y-2' : 'space-x-3'}`}>
                          <button
                            onClick={() => handleMoveToCart(item)}
                            disabled={!item.inStock || isLoading}
                            className={`${viewMode === 'grid' ? 'w-full' : 'flex-1'} btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            disabled={isLoading}
                            className={`${viewMode === 'grid' ? 'w-full' : 'px-4'} btn-secondary flex items-center justify-center space-x-2`}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Empty State */}
      {stats.isEmpty && (
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Heart className="w-24 h-24 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-apple-gray-900 dark:text-apple-gray-100 mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 mb-8">
              Start browsing our premium collection and save your favorite products for later!
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Browse Products</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Wishlist
