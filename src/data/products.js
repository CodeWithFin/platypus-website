// Mock product data for Platypus Liquor Store
export const products = [
  // GIN CATEGORY
  {
    id: 'gin-beefeater',
    name: 'Beefeater London Dry Gin',
    category: 'gin',
    brand: 'Beefeater',
    price: 1850,
    originalPrice: 2100,
    image: '/images/products/beefeater-gin.jpg',
    images: [
      '/images/products/beefeater-gin.jpg',
      '/images/products/beefeater-gin-2.jpg'
    ],
    description: 'A classic London Dry Gin with a crisp, clean taste and distinctive juniper flavor.',
    alcoholContent: '40%',
    size: '750ml',
    origin: 'United Kingdom',
    tastingNotes: ['Juniper', 'Citrus', 'Angelica root', 'Coriander'],
    inStock: true,
    stockCount: 24,
    featured: true,
    rating: 4.5,
    reviews: 128,
    sku: 'GIN-BEE-750'
  },
  {
    id: 'gin-gordons',
    name: "Gordon's London Dry Gin",
    category: 'gin',
    brand: "Gordon's",
    price: 1650,
    originalPrice: 1850,
    image: '/images/products/gordons-gin.jpg',
    images: [
      '/images/products/gordons-gin.jpg',
      '/images/products/gordons-gin-2.jpg'
    ],
    description: 'The world\'s best-selling London Dry Gin with a perfect balance of juniper and citrus.',
    alcoholContent: '37.5%',
    size: '750ml',
    origin: 'United Kingdom',
    tastingNotes: ['Juniper', 'Lemon', 'Orange peel', 'Angelica'],
    inStock: true,
    stockCount: 18,
    featured: false,
    rating: 4.3,
    reviews: 94,
    sku: 'GIN-GOR-750'
  },
  {
    id: 'gin-tanqueray',
    name: 'Tanqueray London Dry Gin',
    category: 'gin',
    brand: 'Tanqueray',
    price: 2150,
    originalPrice: 2400,
    image: '/images/products/tanqueray-gin.jpg',
    images: [
      '/images/products/tanqueray-gin.jpg',
      '/images/products/tanqueray-gin-2.jpg'
    ],
    description: 'A perfectly balanced gin with four botanicals for a smooth, crisp taste.',
    alcoholContent: '43.1%',
    size: '750ml',
    origin: 'United Kingdom',
    tastingNotes: ['Juniper', 'Coriander', 'Angelica', 'Liquorice'],
    inStock: true,
    stockCount: 31,
    featured: true,
    rating: 4.7,
    reviews: 156,
    sku: 'GIN-TAN-750'
  },

  // WHISKY CATEGORY
  {
    id: 'whisky-jameson',
    name: 'Jameson Irish Whiskey',
    category: 'whisky',
    brand: 'Jameson',
    price: 2850,
    originalPrice: 3200,
    image: '/images/products/jameson-whiskey.jpg',
    images: [
      '/images/products/jameson-whiskey.jpg',
      '/images/products/jameson-whiskey-2.jpg'
    ],
    description: 'Triple-distilled Irish whiskey with a smooth, balanced taste.',
    alcoholContent: '40%',
    size: '750ml',
    origin: 'Ireland',
    tastingNotes: ['Vanilla', 'Honey', 'Spices', 'Smooth finish'],
    inStock: true,
    stockCount: 22,
    featured: true,
    rating: 4.6,
    reviews: 203,
    sku: 'WHY-JAM-750'
  },
  {
    id: 'whisky-johnnie-walker-red',
    name: 'Johnnie Walker Red Label',
    category: 'whisky',
    brand: 'Johnnie Walker',
    price: 2450,
    originalPrice: 2750,
    image: '/images/products/johnnie-walker-red.jpg',
    images: [
      '/images/products/johnnie-walker-red.jpg',
      '/images/products/johnnie-walker-red-2.jpg'
    ],
    description: 'The world\'s best-selling Scotch whisky, with a bold and characterful taste.',
    alcoholContent: '40%',
    size: '750ml',
    origin: 'Scotland',
    tastingNotes: ['Spice', 'Smoke', 'Fruit', 'Pepper'],
    inStock: true,
    stockCount: 35,
    featured: false,
    rating: 4.2,
    reviews: 167,
    sku: 'WHY-JWR-750'
  },
  {
    id: 'whisky-johnnie-walker-black',
    name: 'Johnnie Walker Black Label',
    category: 'whisky',
    brand: 'Johnnie Walker',
    price: 3850,
    originalPrice: 4200,
    image: '/images/products/johnnie-walker-black.jpg',
    images: [
      '/images/products/johnnie-walker-black.jpg',
      '/images/products/johnnie-walker-black-2.jpg'
    ],
    description: '12-year-old premium blended Scotch whisky with deep, complex flavors.',
    alcoholContent: '40%',
    size: '750ml',
    origin: 'Scotland',
    tastingNotes: ['Smoke', 'Dark fruit', 'Vanilla', 'Spice'],
    inStock: true,
    stockCount: 19,
    featured: true,
    rating: 4.8,
    reviews: 245,
    sku: 'WHY-JWB-750'
  },

  // WINE CATEGORY
  {
    id: 'wine-kiwara-red',
    name: 'Kiwara Red Wine',
    category: 'wine',
    brand: 'Kiwara',
    price: 1250,
    originalPrice: 1450,
    image: '/images/products/kiwara-red.jpg',
    images: [
      '/images/products/kiwara-red.jpg',
      '/images/products/kiwara-red-2.jpg'
    ],
    description: 'Premium Kenyan red wine with rich, full-bodied flavor.',
    alcoholContent: '12.5%',
    size: '750ml',
    origin: 'Kenya',
    tastingNotes: ['Berry', 'Plum', 'Oak', 'Smooth tannins'],
    inStock: true,
    stockCount: 28,
    featured: false,
    rating: 4.1,
    reviews: 73,
    sku: 'WIN-KIW-RED-750'
  },
  {
    id: 'wine-nederburg-cabernet',
    name: 'Nederburg Cabernet Sauvignon',
    category: 'wine',
    brand: 'Nederburg',
    price: 1850,
    originalPrice: 2100,
    image: '/images/products/nederburg-cabernet.jpg',
    images: [
      '/images/products/nederburg-cabernet.jpg',
      '/images/products/nederburg-cabernet-2.jpg'
    ],
    description: 'South African Cabernet Sauvignon with bold flavors and elegant finish.',
    alcoholContent: '14%',
    size: '750ml',
    origin: 'South Africa',
    tastingNotes: ['Blackcurrant', 'Cedar', 'Vanilla', 'Structured tannins'],
    inStock: true,
    stockCount: 16,
    featured: true,
    rating: 4.4,
    reviews: 89,
    sku: 'WIN-NED-CAB-750'
  },

  // SPIRITS CATEGORY
  {
    id: 'vodka-smirnoff',
    name: 'Smirnoff Vodka',
    category: 'spirits',
    brand: 'Smirnoff',
    price: 1950,
    originalPrice: 2200,
    image: '/images/products/smirnoff-vodka.jpg',
    images: [
      '/images/products/smirnoff-vodka.jpg',
      '/images/products/smirnoff-vodka-2.jpg'
    ],
    description: 'Triple-distilled premium vodka with a clean, crisp taste.',
    alcoholContent: '40%',
    size: '750ml',
    origin: 'United Kingdom',
    tastingNotes: ['Clean', 'Smooth', 'Neutral', 'Crisp finish'],
    inStock: true,
    stockCount: 32,
    featured: false,
    rating: 4.3,
    reviews: 142,
    sku: 'SPR-SMI-VOD-750'
  },
  {
    id: 'rum-captain-morgan',
    name: 'Captain Morgan Spiced Rum',
    category: 'spirits',
    brand: 'Captain Morgan',
    price: 2150,
    originalPrice: 2450,
    image: '/images/products/captain-morgan.jpg',
    images: [
      '/images/products/captain-morgan.jpg',
      '/images/products/captain-morgan-2.jpg'
    ],
    description: 'Caribbean spiced rum with natural flavors and spices.',
    alcoholContent: '35%',
    size: '750ml',
    origin: 'Jamaica',
    tastingNotes: ['Vanilla', 'Spice', 'Caramel', 'Warm finish'],
    inStock: true,
    stockCount: 21,
    featured: true,
    rating: 4.5,
    reviews: 118,
    sku: 'SPR-CAP-RUM-750'
  }
]

export const categories = [
  {
    id: 'gin',
    name: 'Gin',
    description: 'Premium gins from around the world',
    image: '/images/categories/gin-category.jpg',
    productCount: 3
  },
  {
    id: 'whisky',
    name: 'Whisky',
    description: 'Fine whiskies and premium spirits',
    image: '/images/categories/whisky-category.jpg',
    productCount: 3
  },
  {
    id: 'wine',
    name: 'Wine',
    description: 'Curated selection of wines',
    image: '/images/categories/wine-category.jpg',
    productCount: 2
  },
  {
    id: 'spirits',
    name: 'Spirits',
    description: 'Vodka, rum, and other premium spirits',
    image: '/images/categories/spirits-category.jpg',
    productCount: 2
  }
]

export const promotions = [
  {
    id: 'free-delivery',
    title: 'Free Delivery',
    description: 'On orders above KES 2,500 in Nakuru',
    type: 'delivery',
    minOrderAmount: 2500,
    active: true
  },
  {
    id: 'free-ice',
    title: 'Free Ice Package',
    description: 'Complimentary ice with orders above KES 1,000',
    type: 'freebie',
    minOrderAmount: 1000,
    active: true
  },
  {
    id: 'ministers-special',
    title: "Minister's Special",
    description: 'Weekly featured products at special prices',
    type: 'discount',
    discount: 15,
    active: true
  }
]
