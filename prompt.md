# AI Agent Prompt: Build Platypus Liquor Store E-commerce Website

## Project Overview
Create a premium, modern e-commerce website for **Platypus Liquor Store** - a Kenyan liquor retailer with an extensive catalog of gins, whiskies, wines, and spirits. The website should embody Apple's design philosophy while being optimized for the Kenyan market.

## Design Philosophy & Visual Identity
**Apple-Inspired Design Language:**
- **Typography**: Use SF Pro Display/SF Pro Text equivalents (system fonts: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif)
- **Font Hierarchy**: 
  - Headlines: 48px-64px, weight 700, tight letter-spacing (-0.02em)
  - Subheadings: 24px-32px, weight 600
  - Body text: 16px-18px, weight 400, line-height 1.6
  - Small text: 14px, weight 400
- **Color Palette**: 
  - Primary: Deep forest green (#1B4332) matching Platypus brand
  - Secondary: Gold accent (#D4AF37) from logo
  - Neutral: Pure whites, warm grays (#F5F5F7, #86868B, #1D1D1F)
  - Dark mode: True blacks (#000000), dark grays (#1C1C1E, #2C2C2E)

**Animation & Interactions:**
- Smooth 60fps animations using CSS transforms and opacity
- Apple-style easing curves (cubic-bezier(0.25, 0.46, 0.45, 0.94))
- Micro-interactions: hover states, loading animations, parallax scrolling
- Gesture-friendly mobile interactions with proper touch targets (44px minimum)

## Dual Theme Implementation
**Light Mode:**
- Clean white backgrounds (#FFFFFF, #F5F5F7)
- High contrast text (#1D1D1F on light backgrounds)
- Subtle drop shadows (0 4px 20px rgba(0,0,0,0.08))
- Product cards with gentle borders (#E5E5E7)

**Dark Mode:**
- Rich black backgrounds (#000000, #1C1C1E)
- Elevated surfaces (#2C2C2E, #3A3A3C)
- Inverted text colors (#F2F2F7, #AEAEB2)
- Enhanced product imagery with subtle glows
- Seamless theme toggle with system preference detection

## Core E-commerce Features

### Product Management System
- **Inventory Dashboard**: Real-time stock tracking with visual indicators
- **Product Categorization**: 
  - Gin (25+ varieties including Beefeater, Gordon's, Kenyan Originals)
  - Whisky (Scotch, Bourbon, Irish - 30+ varieties)
  - Wine (categorized by type, region, vintage)
  - Premium spirits and mixers
- **Rich Product Details**: 
  - High-resolution product imagery with 360° view capability
  - Detailed descriptions with tasting notes
  - Alcohol content, origin, bottle sizes (250ml, 350ml, 750ml, 1L)
  - Customer reviews and ratings
- **Bulk Import/Export**: CSV/Excel integration for inventory management

### Advanced Shopping Experience
- **Intelligent Search**: Auto-complete, typo tolerance, voice search
- **Multi-layered Filtering**:
  - Category, brand, price range, alcohol content
  - Size, origin, customer ratings
  - Advanced filters for wine (vintage, region, grape variety)
- **Shopping Cart**: 
  - Persistent across sessions
  - Save for later functionality
  - Quick add/remove with smooth animations
  - Cart abandonment recovery via SMS/email

### Checkout & Payments (Kenya-Optimized)
- **Multiple Payment Options**:
  - M-Pesa integration (primary payment method)
  - Airtel Money support
  - Credit/Debit cards (Visa, Mastercard)
  - Cash on delivery option
- **Guest Checkout**: Streamlined single-page checkout
- **Tax Calculation**: Automatic Kenyan VAT and excise duty calculation
- **Age Verification**: Mandatory 18+ verification with ID upload

## Kenya-Specific Features

### Mobile Money Integration
- **M-Pesa STK Push**: Seamless payment flow
- **Transaction Status**: Real-time payment confirmation
- **SMS Notifications**: Payment confirmations and receipts
- **Airtel Money**: Secondary mobile payment option

### Local Delivery Network
- **Nakuru Priority**: Free delivery for orders above 2500 KES
- **Major Cities Coverage**: Nairobi, Mombasa, Kisumu, Eldoret
- **Delivery Scheduling**: Time slot selection
- **Boda Boda Integration**: Last-mile delivery partnerships
- **Signature Required**: Age verification at delivery

### Communication System
- **SMS Integration**: 
  - Order confirmations
  - Delivery tracking updates
  - Promotional campaigns
  - Stock alerts for wishlisted items
- **WhatsApp Support**: Customer service integration
- **Multi-language**: English/Swahili support

## Promotional Features (Based on Catalog)
- **Minister's Offers**: Featured promotion section
- **Dynamic Promotions**:
  - Free ice package (orders >1000 KES)
  - Free delivery (orders >2500 KES in Nakuru)
  - Daily/weekly specials
- **Loyalty Program**: Points-based rewards system
- **Bundle Deals**: Curated product combinations

## User Experience Features

### Customer Account System
- **Personal Dashboard**: Order history, tracking, preferences
- **Wishlist**: Save favorite products with stock notifications
- **Recommendation Engine**: AI-powered suggestions based on purchase history
- **Loyalty Points**: Track and redeem rewards
- **Address Book**: Multiple delivery addresses

### Administrative Dashboard
- **Sales Analytics**: Revenue tracking, popular products, customer insights
- **Inventory Management**: Stock levels, reorder alerts, supplier management
- **Order Fulfillment**: Processing workflow, delivery coordination
- **Customer Management**: User profiles, support tickets, loyalty program
- **Marketing Tools**: Campaign management, email/SMS marketing, promotional codes

## Technical Requirements

### Performance & Mobile Optimization
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Mobile-First Design**: Progressive enhancement from mobile to desktop
- **Touch-Friendly Interface**: Proper gesture support, swipe navigation
- **Offline Capability**: Service worker for basic browsing when offline
- **Image Optimization**: WebP format with fallbacks, lazy loading

### Accessibility & Security
- **WCAG 2.1 AA Compliance**: Screen reader support, keyboard navigation
- **Age Verification**: Robust 18+ checking with document verification
- **Data Security**: HTTPS, PCI DSS compliance for payments
- **Privacy**: GDPR-compliant data handling

### Browser Support
- **Modern Browsers**: Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **Graceful Degradation**: Basic functionality on older browsers
- **Cross-Platform**: iOS Safari, Android Chrome optimization

## Content Strategy
- **Product Photography**: Professional bottle photography with consistent lighting
- **Educational Content**: Tasting guides, cocktail recipes, pairing suggestions
- **Brand Storytelling**: Platypus brand narrative, local partnerships
- **SEO Optimization**: Kenyan search terms, local business optimization

## Implementation Notes
- Use modern web technologies (HTML5, CSS3, ES6+)
- Component-based architecture for maintainability
- Progressive Web App (PWA) capabilities
- Integration APIs for M-Pesa, delivery services, SMS providers
- Analytics integration (Google Analytics, local alternatives)

## Success Metrics
- Conversion rate optimization (target: 3-5%)
- Mobile traffic engagement (target: 65%+ mobile users)
- Average order value increase through recommendations
- Customer retention through loyalty program
- Page load speed optimization (<3 seconds on 3G)

## Final Design Considerations
Create a website that feels premium and trustworthy while being accessible to all Kenyan users. The design should honor the Platypus brand identity while incorporating Apple's timeless design principles. Every interaction should feel intentional, smooth, and delightful - from browsing products to completing a purchase.

The end result should be a world-class e-commerce experience that sets the standard for online liquor retail in Kenya, combining international design excellence with local market understanding.