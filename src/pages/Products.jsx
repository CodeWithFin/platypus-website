import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  ChevronDown,
  X,
  Star
} from 'lucide-react'
import { products, categories } from '@/data/products'
import { debounce } from '@/utils/helpers'
import ProductCard from '@/components/product/ProductCard'

const Products = () => {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State management
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    brands: [],
    alcoholContent: [],
    rating: 0,
    inStock: false
  })

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const brands = [...new Set(products.map(p => p.brand))].sort()
    const alcoholRanges = [
      { label: '0-20%', min: 0, max: 20 },
      { label: '20-30%', min: 20, max: 30 },
      { label: '30-40%', min: 30, max: 40 },
      { label: '40%+', min: 40, max: 100 }
    ]
    
    return { brands, alcoholRanges }
  }, [])

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query) => {
      if (query) {
        setSearchParams({ search: query })
      } else {
        setSearchParams({})
      }
    }, 300),
    [setSearchParams]
  )

  // Filter and search logic
  useEffect(() => {
    setIsLoading(true)
    
    let result = [...products]
    
    // Filter by category
    if (category) {
      result = result.filter(product => product.category === category)
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
    }
    
    // Price range filter
    result = result.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )
    
    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter(product => filters.brands.includes(product.brand))
    }
    
    // Alcohol content filter
    if (filters.alcoholContent.length > 0) {
      result = result.filter(product => {
        const alcoholPercent = parseFloat(product.alcoholContent)
        return filters.alcoholContent.some(range => 
          alcoholPercent >= range.min && alcoholPercent <= range.max
        )
      })
    }
    
    // Rating filter
    if (filters.rating > 0) {
      result = result.filter(product => product.rating >= filters.rating)
    }
    
    // Stock filter
    if (filters.inStock) {
      result = result.filter(product => product.inStock)
    }
    
    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        // Would sort by creation date in real app
        result.sort((a, b) => b.id.localeCompare(a.id))
        break
      default:
        // Featured first, then by rating
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        })
    }
    
    setFilteredProducts(result)
    setIsLoading(false)
  }, [category, searchQuery, filters, sortBy])

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSearch(value)
  }

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      
      switch (filterType) {
        case 'brand':
          if (newFilters.brands.includes(value)) {
            newFilters.brands = newFilters.brands.filter(b => b !== value)
          } else {
            newFilters.brands = [...newFilters.brands, value]
          }
          break
        case 'alcoholContent':
          if (newFilters.alcoholContent.some(range => range.label === value.label)) {
            newFilters.alcoholContent = newFilters.alcoholContent.filter(r => r.label !== value.label)
          } else {
            newFilters.alcoholContent = [...newFilters.alcoholContent, value]
          }
          break
        case 'rating':
          newFilters.rating = newFilters.rating === value ? 0 : value
          break
        case 'inStock':
          newFilters.inStock = !newFilters.inStock
          break
        case 'priceRange':
          newFilters.priceRange = value
          break
        default:
          break
      }
      
      return newFilters
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      brands: [],
      alcoholContent: [],
      rating: 0,
      inStock: false
    })
    setSearchQuery('')
    setSearchParams({})
  }

  // Get current category info
  const currentCategory = categories.find(cat => cat.id === category)
  const pageTitle = currentCategory ? currentCategory.name : 'All Products'
  const pageDescription = currentCategory ? currentCategory.description : 'Discover our complete collection of premium spirits'

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'newest', label: 'Newest First' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-apple-gray-900 dark:text-white mb-4">
            {pageTitle}
          </h1>
          <p className="text-lg text-apple-gray-600 dark:text-apple-gray-300 max-w-2xl">
            {pageDescription}
          </p>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-apple-gray-300 dark:border-apple-gray-600 rounded-xl bg-white dark:bg-apple-gray-800 text-apple-gray-900 dark:text-white focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-apple-gray-800 border border-apple-gray-300 dark:border-apple-gray-600 rounded-xl px-4 py-3 pr-10 text-apple-gray-900 dark:text-white focus:ring-2 focus:ring-platypus-green-500 focus:border-transparent transition-colors"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-apple-gray-500 pointer-events-none" />
              </div>

              {/* View mode toggle */}
              <div className="flex bg-apple-gray-100 dark:bg-apple-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-apple-gray-700 text-platypus-green-500'
                      : 'text-apple-gray-500 hover:text-apple-gray-700 dark:hover:text-apple-gray-300'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-apple-gray-700 text-platypus-green-500'
                      : 'text-apple-gray-500 hover:text-apple-gray-700 dark:hover:text-apple-gray-300'
                  }`}
                  aria-label="List view"
                >
                  <List size={20} />
                </button>
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center space-x-2 py-3 px-4"
              >
                <SlidersHorizontal size={20} />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(filters.brands.length > 0 || filters.alcoholContent.length > 0 || filters.rating > 0 || filters.inStock || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400">Active filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center space-x-1 bg-platypus-green-100 dark:bg-platypus-green-900/30 text-platypus-green-700 dark:text-platypus-green-300 px-3 py-1 rounded-full text-sm">
                  <span>Search: {searchQuery}</span>
                  <button onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {filters.brands.map(brand => (
                <span key={brand} className="inline-flex items-center space-x-1 bg-platypus-green-100 dark:bg-platypus-green-900/30 text-platypus-green-700 dark:text-platypus-green-300 px-3 py-1 rounded-full text-sm">
                  <span>{brand}</span>
                  <button onClick={() => handleFilterChange('brand', brand)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              
              {filters.alcoholContent.map(range => (
                <span key={range.label} className="inline-flex items-center space-x-1 bg-platypus-green-100 dark:bg-platypus-green-900/30 text-platypus-green-700 dark:text-platypus-green-300 px-3 py-1 rounded-full text-sm">
                  <span>{range.label} ABV</span>
                  <button onClick={() => handleFilterChange('alcoholContent', range)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              
              {filters.rating > 0 && (
                <span className="inline-flex items-center space-x-1 bg-platypus-green-100 dark:bg-platypus-green-900/30 text-platypus-green-700 dark:text-platypus-green-300 px-3 py-1 rounded-full text-sm">
                  <span>{filters.rating}+ stars</span>
                  <button onClick={() => handleFilterChange('rating', filters.rating)}>
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {filters.inStock && (
                <span className="inline-flex items-center space-x-1 bg-platypus-green-100 dark:bg-platypus-green-900/30 text-platypus-green-700 dark:text-platypus-green-300 px-3 py-1 rounded-full text-sm">
                  <span>In Stock Only</span>
                  <button onClick={() => handleFilterChange('inStock')}>
                    <X size={14} />
                  </button>
                </span>
              )}
              
              <button
                onClick={clearFilters}
                className="text-sm text-apple-gray-500 hover:text-apple-gray-700 dark:hover:text-apple-gray-300 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="lg:w-64 lg:flex-shrink-0"
              >
                <div className="card p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-apple-gray-900 dark:text-white">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden p-1 text-apple-gray-500 hover:text-apple-gray-700 dark:hover:text-apple-gray-300"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-3">
                        Price Range
                      </label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          step="100"
                          value={filters.priceRange[1]}
                          onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                          className="w-full accent-platypus-green-500"
                        />
                        <div className="flex justify-between text-sm text-apple-gray-600 dark:text-apple-gray-400">
                          <span>KES 0</span>
                          <span>KES {filters.priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Brands */}
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-3">
                        Brands
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {filterOptions.brands.map(brand => (
                          <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.brands.includes(brand)}
                              onChange={() => handleFilterChange('brand', brand)}
                              className="rounded border-apple-gray-300 dark:border-apple-gray-600 text-platypus-green-500 focus:ring-platypus-green-500"
                            />
                            <span className="text-sm text-apple-gray-700 dark:text-apple-gray-300">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Alcohol Content */}
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-3">
                        Alcohol Content
                      </label>
                      <div className="space-y-2">
                        {filterOptions.alcoholRanges.map(range => (
                          <label key={range.label} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.alcoholContent.some(r => r.label === range.label)}
                              onChange={() => handleFilterChange('alcoholContent', range)}
                              className="rounded border-apple-gray-300 dark:border-apple-gray-600 text-platypus-green-500 focus:ring-platypus-green-500"
                            />
                            <span className="text-sm text-apple-gray-700 dark:text-apple-gray-300">{range.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 mb-3">
                        Minimum Rating
                      </label>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map(rating => (
                          <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="rating"
                              checked={filters.rating === rating}
                              onChange={() => handleFilterChange('rating', rating)}
                              className="border-apple-gray-300 dark:border-apple-gray-600 text-platypus-green-500 focus:ring-platypus-green-500"
                            />
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={`${
                                    i < rating
                                      ? 'text-platypus-gold-400 fill-current'
                                      : 'text-apple-gray-300 dark:text-apple-gray-600'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-apple-gray-700 dark:text-apple-gray-300 ml-1">& up</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Stock filter */}
                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.inStock}
                          onChange={() => handleFilterChange('inStock')}
                          className="rounded border-apple-gray-300 dark:border-apple-gray-600 text-platypus-green-500 focus:ring-platypus-green-500"
                        />
                        <span className="text-sm text-apple-gray-700 dark:text-apple-gray-300">In Stock Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products grid */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-apple-gray-600 dark:text-apple-gray-400">
                {isLoading ? 'Loading...' : `${filteredProducts.length} products found`}
              </p>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card p-4">
                    <div className="aspect-[3/4] bg-apple-gray-200 dark:bg-apple-gray-700 rounded-xl mb-4 loading-shimmer" />
                    <div className="h-4 bg-apple-gray-200 dark:bg-apple-gray-700 rounded mb-2 loading-shimmer" />
                    <div className="h-3 bg-apple-gray-200 dark:bg-apple-gray-700 rounded mb-2 loading-shimmer w-3/4" />
                    <div className="h-6 bg-apple-gray-200 dark:bg-apple-gray-700 rounded loading-shimmer w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <ProductCard 
                        product={product} 
                        className={viewMode === 'list' ? 'flex-row' : ''}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-apple-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
