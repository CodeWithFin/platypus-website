import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('platypus_wishlist')
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('platypus_wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = async (product) => {
    setIsLoading(true)
    
    try {
      // Check if item already exists
      const existingItem = wishlistItems.find(item => item.id === product.id)
      
      if (existingItem) {
        toast.error('Item is already in your wishlist')
        return false
      }

      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        dateAdded: new Date().toISOString()
      }

      setWishlistItems(prev => [...prev, wishlistItem])
      toast.success(`${product.name} added to wishlist!`)
      return true
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add item to wishlist')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (productId) => {
    setIsLoading(true)
    
    try {
      const itemToRemove = wishlistItems.find(item => item.id === productId)
      
      setWishlistItems(prev => prev.filter(item => item.id !== productId))
      
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from wishlist`)
      }
      return true
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove item from wishlist')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const clearWishlist = async () => {
    setIsLoading(true)
    
    try {
      setWishlistItems([])
      toast.success('Wishlist cleared successfully')
      return true
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      toast.error('Failed to clear wishlist')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId)
  }

  const getWishlistItem = (productId) => {
    return wishlistItems.find(item => item.id === productId)
  }

  const moveToCart = async (productId, addToCart) => {
    const item = wishlistItems.find(item => item.id === productId)
    
    if (!item) {
      toast.error('Item not found in wishlist')
      return false
    }

    if (!item.inStock) {
      toast.error('Item is currently out of stock')
      return false
    }

    try {
      // Add to cart
      const success = await addToCart(item, 1)
      
      if (success) {
        // Remove from wishlist
        await removeFromWishlist(productId)
        toast.success(`${item.name} moved to cart!`)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error moving item to cart:', error)
      toast.error('Failed to move item to cart')
      return false
    }
  }

  const getWishlistStats = () => {
    const totalItems = wishlistItems.length
    const inStockItems = wishlistItems.filter(item => item.inStock).length
    const outOfStockItems = totalItems - inStockItems
    const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0)
    
    const categories = wishlistItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})

    return {
      totalItems,
      inStockItems,
      outOfStockItems,
      totalValue,
      categories,
      isEmpty: totalItems === 0
    }
  }

  const sortWishlist = (sortBy = 'dateAdded', order = 'desc') => {
    const sorted = [...wishlistItems].sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'dateAdded':
          aValue = new Date(a.dateAdded)
          bValue = new Date(b.dateAdded)
          break
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        default:
          aValue = new Date(a.dateAdded)
          bValue = new Date(b.dateAdded)
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setWishlistItems(sorted)
  }

  const filterWishlist = (filters) => {
    let filtered = [...wishlistItems]

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category)
    }

    if (filters.inStock !== undefined) {
      filtered = filtered.filter(item => item.inStock === filters.inStock)
    }

    if (filters.priceRange) {
      const { min, max } = filters.priceRange
      filtered = filtered.filter(item => item.price >= min && item.price <= max)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.brand.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }

  const value = {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistItem,
    moveToCart,
    getWishlistStats,
    sortWishlist,
    filterWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}
