// Utility functions for the Platypus Liquor Store

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price)
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-KE').format(number)
}

export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Format phone number for Kenya
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it starts with 254 (Kenya country code)
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`
  }
  
  // Check if it starts with 0 (local format)
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.slice(1)}`
  }
  
  // Assume it's a local number without leading 0
  if (cleaned.length === 9) {
    return `+254${cleaned}`
  }
  
  return phone // Return original if can't format
}

// Validate Kenyan phone number
export const validateKenyanPhone = (phone) => {
  if (!phone) return false
  
  const cleaned = phone.replace(/\D/g, '')
  // Should be 12 digits with 254 prefix or 10 digits with 0 prefix or 9 digits
  return (
    (cleaned.startsWith('254') && cleaned.length === 12) ||
    (cleaned.startsWith('0') && cleaned.length === 10) ||
    cleaned.length === 9
  )
}

export const formatKenyanPhone = (phone) => {
  // Format to +254 format
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.startsWith('+254')) return cleaned
  if (cleaned.startsWith('254')) return `+${cleaned}`
  if (cleaned.startsWith('0')) return `+254${cleaned.slice(1)}`
  return `+254${cleaned}`
}

export const isValidAge = (dateOfBirth) => {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18
  }
  return age >= 18
}

export const generateOrderId = () => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substr(2, 5)
  return `PLT-${timestamp}-${randomStr}`.toUpperCase()
}

export const getTimeOfDay = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

export const getGreeting = (name) => {
  const timeOfDay = getTimeOfDay()
  const greetings = {
    morning: ['Good morning', 'Habari za asubuhi'],
    afternoon: ['Good afternoon', 'Habari za mchana'],
    evening: ['Good evening', 'Habari za jioni']
  }
  
  const greeting = greetings[timeOfDay][Math.floor(Math.random() * 2)]
  return name ? `${greeting}, ${name}!` : `${greeting}!`
}

export const calculateDeliveryFee = (subtotal, location = 'nakuru') => {
  // Free delivery for orders above 2500 KES in Nakuru
  if (location.toLowerCase() === 'nakuru' && subtotal >= 2500) {
    return 0
  }
  
  // Delivery fees by location
  const deliveryFees = {
    nakuru: 200,
    nairobi: 300,
    mombasa: 400,
    kisumu: 350,
    eldoret: 300,
    default: 250
  }
  
  return deliveryFees[location.toLowerCase()] || deliveryFees.default
}

export const calculateTax = (amount) => {
  // Kenyan VAT is 16%
  const VAT_RATE = 0.16
  return Math.round(amount * VAT_RATE)
}

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return new Intl.DateTimeFormat('en-KE', defaultOptions).format(new Date(date))
}

export const getRelativeTime = (date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return formatDate(date)
}

export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}
