import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, X, Plus } from 'lucide-react';
import { useCart } from './CartProvider';
import { useFavorites } from './FavoritesProvider';
import { LoginPrompt } from './LoginPrompt';

interface CollectionShowcaseProps {
  title: string;
  subtitle: string;
  description: string;
  products?: Product[];
}

interface Product {
  id: number;
  name: string;
  category: { name: string; slug: string };
  price: number;
  images: string[];
  description: string;
  available_sizes: string[];
  available_colors: string[];
  slug: string;
  featured: boolean;
}

interface PopupProduct extends Product {
  isOpen: boolean;
}

export function CollectionShowcase({ title, subtitle, description, products: propProducts = [] }: CollectionShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<PopupProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const categories = ['ALL', 'Casual', 'Gym', 'Official'];
  
  // Use passed products or fallback to empty array
  const products = propProducts || [];

  const filteredProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(product => product?.category?.name === activeCategory);

  // Debug: Log the number of products being displayed
  console.log(`Active category: ${activeCategory}, Total products: ${products.length}, Filtered products: ${filteredProducts.length}`);





  const openProductPopup = (product: Product) => {
    setSelectedProduct({ ...product, isOpen: true });
    setSelectedSize(product.available_sizes?.[0] || '');
    setSelectedColor(product.available_colors?.[0] || '');
    document.body.style.overflow = 'hidden';
  };

  const closeProductPopup = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  const handleLikeClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user is logged in (you can implement this check based on your auth system)
    const isLoggedIn = false; // Replace with actual auth check
    
    if (isLoggedIn) {
      toggleFavorite({
        id: product.id,
        name: product.name || 'Product',
        price: product.price || 0,
        image: product.images?.[0] || '/images/chamly/11.jpeg',
        slug: product.slug || `product-${product.id}`,
        category: product.category?.name || 'Product'
      });
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-600 rounded-full px-6 py-2 mb-6">
              <span className="text-sm font-medium tracking-wide">LifeWear COLLECTION</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-gray-900 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Staggered Masonry Grid */}
          <div className="mt-8">
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
              {/* Start with a Category Block */}
              <div className="break-inside-avoid mb-8">
                <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-white p-8 rounded-2xl shadow-xl">
                  <h3 className="text-3xl font-serif font-bold mb-3 text-center">
                    {activeCategory === 'ALL' ? 'Premium' : activeCategory}
                  </h3>
                  <h4 className="text-3xl font-serif font-bold mb-3 text-center">
                    Collection
                  </h4>
                  <p className="text-xl font-serif italic text-center text-amber-100">
                    {activeCategory === 'ALL' ? 'Luxury Craftsmanship' : 
                     activeCategory === 'Casual' ? 'Everyday Comfort' :
                     activeCategory === 'Gym' ? 'Performance Ready' :
                     'Professional Excellence'}
                  </p>
                </div>
              </div>

              {/* Product Images with Uniform Spacing */}
              {filteredProducts.filter(product => product && product.images && product.images.length > 0).map((product, index) => (
                <div 
                  key={product.id} 
                  className="break-inside-avoid mb-8 group cursor-pointer"
                  onClick={() => {
                    if (product.available_sizes?.length && product.available_colors?.length) {
                      openProductPopup(product);
                    }
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <img
                      src={product.images?.[0] || '/images/chamly/11.jpeg'}
                      alt={product.name || 'Product'}
                      className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                        // Varying heights for staggered effect
                        index % 4 === 0 ? 'h-80' :
                        index % 4 === 1 ? 'h-96' :
                        index % 4 === 2 ? 'h-72' : 'h-88'
                      }`}
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="font-bold text-lg mb-1">{product.name || 'Product'}</h4>
                        <p className="text-sm text-gray-200 mb-2">{product.description || 'No description available'}</p>
                        <p className="text-xl font-bold">KES {product.price?.toLocaleString() || '0'}</p>
                        {product.category?.name && (
                          <p className="text-xs text-gray-300 mt-1">{product.category.name}</p>
                        )}
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={(e) => handleLikeClick(product, e)}
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-white'}`} />
                        </button>
                        {(!product.available_sizes?.length || !product.available_colors?.length) && (
                          <div 
                            className="w-10 h-10 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center cursor-help"
                            title="Product configuration incomplete - sizes or colors not configured"
                          >
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                        )}
                        {product.available_sizes?.length && product.available_colors?.length && (
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Additional Category Block after Products */}
              <div className="break-inside-avoid mb-8">
                <div className="bg-gradient-to-br from-purple-700 to-purple-800 text-white p-8 rounded-2xl shadow-xl">
                  <h3 className="text-3xl font-serif font-bold mb-3 text-center">
                    {activeCategory === 'ALL' ? 'Exclusive' : activeCategory}
                  </h3>
                  <h4 className="text-3xl font-serif font-bold mb-3 text-center">
                    Collection
                  </h4>
                  <p className="text-xl font-serif italic text-center text-purple-100">
                    {activeCategory === 'ALL' ? 'Limited Edition Pieces' : 
                     activeCategory === 'Casual' ? 'Premium Casual Wear' :
                     activeCategory === 'Gym' ? 'High-Performance Gear' :
                     'Professional Attire'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Link href="/shop">
              <div className="inline-flex items-center space-x-4 bg-gray-900 text-white rounded-2xl px-8 py-4 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <span className="text-lg font-semibold">Explore Full Collection</span>
                <ShoppingCart className="h-5 w-5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Popup Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeProductPopup}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Product Image */}
                                   <div className="relative h-80 overflow-hidden rounded-t-3xl">
                       <img
                         src={selectedProduct.images?.[0] || '/images/chamly/11.jpeg'}
                         alt={selectedProduct.name || 'Product'}
                         className="w-full h-full object-cover"
                       />
                     </div>

              {/* Product Details */}
              <div className="p-8">
                <div className="mb-4">
                                           <span className="inline-block bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full mb-3">
                           {selectedProduct.category?.name || 'Product'}
                         </span>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name || 'Product'}</h3>
                  <p className="text-gray-600 mb-4">{selectedProduct.description || 'No description available'}</p>
                  <p className="text-3xl font-bold text-gray-900">KES {selectedProduct.price?.toLocaleString() || '0'}</p>
                </div>

                {/* Sizes */}
                {selectedProduct.available_sizes && selectedProduct.available_sizes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Available Sizes</h4>
                    <div className="flex gap-2">
                      {selectedProduct.available_sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            selectedSize === size
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-200 hover:border-gray-900'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {selectedProduct.available_colors && selectedProduct.available_colors.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-3">Available Colors</h4>
                    <div className="flex gap-2">
                      {selectedProduct.available_colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1 rounded-full transition-colors ${
                          selectedColor === color
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {selectedProduct.available_sizes?.length && selectedProduct.available_colors?.length ? (
                    <Button 
                      onClick={() => {
                        if (selectedSize && selectedColor && selectedProduct) {
                          addToCart({
                            id: selectedProduct.id,
                            name: selectedProduct.name || 'Product',
                            price: selectedProduct.price || 0,
                            image: selectedProduct.images?.[0] || '/images/chamly/11.jpeg',
                            size: selectedSize,
                            color: selectedColor,
                            category: selectedProduct.category?.name || 'Product'
                          });
                          closeProductPopup();
                        }
                      }}
                      disabled={!selectedSize || !selectedColor}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex-1 text-center py-3 text-gray-500">
                      Product configuration required
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="px-6 py-3 rounded-xl border-gray-300 hover:border-gray-900"
                    onClick={() => {
                      if (selectedProduct) {
                        toggleFavorite({
                          id: selectedProduct.id,
                          name: selectedProduct.name || 'Product',
                          price: selectedProduct.price || 0,
                          image: selectedProduct.images?.[0] || '/images/chamly/11.jpeg',
                          slug: selectedProduct.slug || `product-${selectedProduct.id}`,
                          category: selectedProduct.category?.name || 'Product'
                        });
                      }
                    }}
                  >
                    <Heart className={`w-5 h-5 ${selectedProduct && isFavorite(selectedProduct.id) ? 'text-red-500 fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
                   )}

             {/* Login Prompt */}
             <LoginPrompt
               isOpen={showLoginPrompt}
               onClose={() => setShowLoginPrompt(false)}
               onLogin={() => setShowLoginPrompt(false)}
             />
           </>
         );
       }
