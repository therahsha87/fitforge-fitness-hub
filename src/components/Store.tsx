'use client'

import React, { useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  reviews: number
  description: string
  inStock: boolean
  badge?: string
}

interface CartItem extends Product {
  quantity: number
}

const Store: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState<boolean>(false)

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'supplements', name: 'Supplements', icon: '💊' },
    { id: 'equipment', name: 'Equipment', icon: '🏋️‍♂️' },
    { id: 'apparel', name: 'Apparel', icon: '👕' },
    { id: 'accessories', name: 'Accessories', icon: '⌚' }
  ]

  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Whey Protein',
      price: 49.99,
      originalPrice: 59.99,
      category: 'supplements',
      image: '💊',
      rating: 4.8,
      reviews: 234,
      description: 'High-quality whey protein for muscle building and recovery',
      inStock: true,
      badge: 'Bestseller'
    },
    {
      id: '2',
      name: 'Adjustable Dumbbells',
      price: 199.99,
      category: 'equipment',
      image: '🏋️‍♂️',
      rating: 4.6,
      reviews: 156,
      description: 'Space-saving adjustable dumbbells, 5-50 lbs',
      inStock: true
    },
    {
      id: '3',
      name: 'Yoga Mat Premium',
      price: 34.99,
      originalPrice: 44.99,
      category: 'equipment',
      image: '🧘‍♀️',
      rating: 4.9,
      reviews: 312,
      description: 'Non-slip yoga mat with excellent cushioning',
      inStock: true,
      badge: 'Top Rated'
    },
    {
      id: '4',
      name: 'Performance Tank Top',
      price: 24.99,
      category: 'apparel',
      image: '👕',
      rating: 4.4,
      reviews: 89,
      description: 'Moisture-wicking athletic tank top',
      inStock: true
    },
    {
      id: '5',
      name: 'Fitness Tracker Pro',
      price: 149.99,
      originalPrice: 179.99,
      category: 'accessories',
      image: '⌚',
      rating: 4.7,
      reviews: 445,
      description: 'Advanced fitness tracking with heart rate monitoring',
      inStock: false,
      badge: 'Limited'
    },
    {
      id: '6',
      name: 'BCAA Recovery',
      price: 29.99,
      category: 'supplements',
      image: '🥤',
      rating: 4.5,
      reviews: 178,
      description: 'Branch-chain amino acids for faster recovery',
      inStock: true
    },
    {
      id: '7',
      name: 'Resistance Bands Set',
      price: 39.99,
      category: 'equipment',
      image: '🎯',
      rating: 4.3,
      reviews: 267,
      description: 'Complete set of resistance bands with door anchor',
      inStock: true
    },
    {
      id: '8',
      name: 'Pre-Workout Boost',
      price: 34.99,
      category: 'supplements',
      image: '⚡',
      rating: 4.6,
      reviews: 323,
      description: 'Energy and focus booster for intense workouts',
      inStock: true,
      badge: 'New'
    }
  ]

  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  )

  const addToCart = (product: Product): void => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string): void => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const renderStars = (rating: number): JSX.Element[] => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-600">☆</span>)
    }
    return stars
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">FitForge Store</h1>
            <p className="text-gray-300">Premium fitness products for your journey</p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🛒 Cart
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
        <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-500/10 text-gray-300 hover:bg-purple-500/20'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-colors"
          >
            {/* Product Badge */}
            {product.badge && (
              <div className="absolute top-2 right-2 z-10">
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  product.badge === 'Bestseller' ? 'bg-green-500 text-white' :
                  product.badge === 'Top Rated' ? 'bg-blue-500 text-white' :
                  product.badge === 'New' ? 'bg-purple-500 text-white' :
                  product.badge === 'Limited' ? 'bg-red-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {product.badge}
                </span>
              </div>
            )}

            <div className="p-6">
              {/* Product Image */}
              <div className="text-6xl text-center mb-4">{product.image}</div>

              {/* Product Info */}
              <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-400">({product.reviews})</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold text-white">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  product.inStock
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-gray-900 h-full w-full max-w-md p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🛒</div>
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{item.image}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{item.name}</h4>
                          <p className="text-sm text-gray-400">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-purple-600 hover:bg-purple-700 rounded text-white flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="text-white min-w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-purple-600 hover:bg-purple-700 rounded text-white flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-purple-500/20 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-xl font-bold text-white">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-colors">
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-12 border border-purple-500/20 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
          <p className="text-gray-400">Try selecting a different category</p>
        </div>
      )}
    </div>
  )
}

export default Store
