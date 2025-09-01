'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Search, 
  Star, 
  Plus,
  Minus,
  Package,
  Zap,
  Award,
  Truck,
  Shield,
  Filter,
  Heart
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  inStock: boolean;
  featured: boolean;
  badges: string[];
}

interface CartItem extends Product {
  quantity: number;
}

const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);

  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Whey Protein',
      category: 'supplements',
      price: 49.99,
      originalPrice: 59.99,
      rating: 4.8,
      reviews: 1250,
      image: '/placeholder-protein.jpg',
      description: 'High-quality whey protein isolate for muscle building and recovery',
      inStock: true,
      featured: true,
      badges: ['Best Seller', 'Sale']
    },
    {
      id: '2',
      name: 'Adjustable Dumbbell Set',
      category: 'equipment',
      price: 299.99,
      rating: 4.9,
      reviews: 890,
      image: '/placeholder-dumbbells.jpg',
      description: 'Professional adjustable dumbbells with quick-lock system',
      inStock: true,
      featured: true,
      badges: ['Premium Quality']
    },
    {
      id: '3',
      name: 'Pre-Workout Energy Boost',
      category: 'supplements',
      price: 34.99,
      originalPrice: 39.99,
      rating: 4.7,
      reviews: 2100,
      image: '/placeholder-preworkout.jpg',
      description: 'Clean energy and focus for intense training sessions',
      inStock: true,
      featured: false,
      badges: ['Natural Ingredients']
    },
    {
      id: '4',
      name: 'Resistance Band Set',
      category: 'equipment',
      price: 24.99,
      rating: 4.6,
      reviews: 670,
      image: '/placeholder-bands.jpg',
      description: 'Complete resistance band set for full-body workouts',
      inStock: true,
      featured: false,
      badges: ['Portable']
    },
    {
      id: '5',
      name: 'Creatine Monohydrate',
      category: 'supplements',
      price: 19.99,
      rating: 4.9,
      reviews: 3200,
      image: '/placeholder-creatine.jpg',
      description: 'Pure creatine monohydrate for strength and power',
      inStock: true,
      featured: false,
      badges: ['Research Proven']
    },
    {
      id: '6',
      name: 'Smart Fitness Tracker',
      category: 'accessories',
      price: 129.99,
      originalPrice: 149.99,
      rating: 4.5,
      reviews: 1800,
      image: '/placeholder-tracker.jpg',
      description: 'Advanced fitness tracking with heart rate monitoring',
      inStock: false,
      featured: true,
      badges: ['Tech', 'Coming Soon']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'supplements', name: 'Supplements', icon: Zap },
    { id: 'equipment', name: 'Equipment', icon: Package },
    { id: 'accessories', name: 'Accessories', icon: Award }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.filter(product => product.featured);

  const addToCart = (product: Product): void => {
    if (!product.inStock) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string): void => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <Package className="w-16 h-16 text-gray-400" />
        </div>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {product.rating} ({product.reviews})
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        
        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.badges.map((badge, index) => (
              <Badge 
                key={index} 
                variant={badge === 'Sale' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {!product.inStock && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <Button 
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className="w-full"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header with Cart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
                <span>FitForge Store</span>
              </CardTitle>
              <p className="text-gray-600">
                Premium fitness supplements, equipment, and accessories
              </p>
            </div>
            
            {/* Cart Button */}
            <Button 
              variant="outline" 
              onClick={() => setShowCart(!showCart)}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Cart Sidebar */}
      {showCart && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Shopping Cart ({getTotalItems()} items)</span>
              <Button variant="ghost" onClick={() => setShowCart(false)}>
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total: ${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full">
                      Proceed to Checkout
                    </Button>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Truck className="w-4 h-4" />
                        <span>Free shipping over $75</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4" />
                        <span>Secure checkout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex space-x-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center space-x-1"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Store Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Truck className="w-12 h-12 mx-auto text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-600">Free delivery on orders over $75</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">Secure Payment</h3>
            <p className="text-sm text-gray-600">100% secure payment processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-12 h-12 mx-auto text-purple-600 mb-3" />
            <h3 className="font-semibold mb-2">Quality Guarantee</h3>
            <p className="text-sm text-gray-600">Premium quality or money back</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Store;
