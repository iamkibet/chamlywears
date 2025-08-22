import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
  has_variants?: boolean;
  available_colors?: string[];
  available_sizes?: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (onAddToCart) {
      setIsLoading(true);
      try {
        onAddToCart(product);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const discountPercentage = product.compare_at_price 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images[0] || '/images/chamly/11.jpeg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
          {product.category.name}
        </div>

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Link href={`/product/${product.slug}`}>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
          ))}
          <span className="text-xs text-white ml-2 font-medium">(24)</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="text-sm text-gray-500 mb-3 font-medium">
          {product.category.name}
        </div>
        
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif font-semibold text-gray-900 mb-3 text-lg hover:text-blue-600 transition-colors duration-200 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            KES {product.price.toLocaleString()}
          </span>
          {product.compare_at_price && (
            <span className="text-lg text-gray-500 line-through">
              KES {product.compare_at_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-3 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
