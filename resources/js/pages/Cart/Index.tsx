import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Heart, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  User, 
  Truck, 
  Shield, 
  Gift,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useCart } from '@/components/common/CartProvider';
import { useFavorites } from '@/components/common/FavoritesProvider';
import { businessConfig } from '@/config/business';

export default function Cart() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const { state: favoritesState } = useFavorites();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Get user data from Inertia page props
  const { auth } = usePage().props as any;
  const isLoggedIn = !!auth?.user;
  const user = auth?.user;
  
  // Mock user data for development (replace with real data from backend)
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254 700 000 000',
    address: '123 Main Street, Nairobi, Kenya'
  };
  
  // Use real user data if available, otherwise use mock data
  const currentUser = user || mockUser;

  const calculateSubtotal = () => {
    return state.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= businessConfig.freeShippingThreshold ? 0 : businessConfig.defaultShippingCost;
  };

  const calculateTax = () => {
    return calculateSubtotal() * businessConfig.vatRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleWhatsAppCheckout = () => {
    if (state.items.length === 0) return;

    // Format order summary with proper line breaks
    const orderSummary = state.items.map(item => 
      `• ${item.name} (${item.size || 'N/A'}, ${item.color || 'N/A'}) - KES ${item.price.toLocaleString()} x${item.quantity || 1}`
    ).join('\n');

    // Create customer details section
    const customerDetails = isLoggedIn ? `
*Customer Details:*
• Name: ${currentUser.name}
• Phone: ${currentUser.phone}
• Email: ${currentUser.email}
• Address: ${currentUser.address}` : '';

    // Create a well-formatted WhatsApp message
    const message = `🛍️ *NEW ORDER - Chamly Wears*

*Order Summary:*
${orderSummary}

*Order Details:*
• Subtotal: KES ${calculateSubtotal().toLocaleString()}
• Shipping: ${calculateShipping() === 0 ? 'FREE' : `KES ${calculateShipping().toLocaleString()}`}
• Tax (VAT): KES ${calculateTax().toLocaleString()}
• *Total: KES ${calculateTotal().toLocaleString()}*

${customerDetails}

*Customer Request:*
Please process this order and provide payment details. I'm ready to complete the purchase.

Thank you! 🙏`;

    // Use business configuration for WhatsApp number
    const whatsappNumber = businessConfig.whatsappNumber;
    
    // Create WhatsApp URL with proper encoding
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Debug logging
    console.log('WhatsApp Checkout Debug:', {
      items: state.items,
      message: message,
      whatsappNumber: whatsappNumber,
      whatsappUrl: whatsappUrl,
      encodedMessage: encodeURIComponent(message)
    });
    
    // Open WhatsApp in new tab
    try {
      const newWindow = window.open(whatsappUrl, '_blank');
      
      if (!newWindow) {
        // If popup blocked, try to redirect
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      
      // Fallback: copy message to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(message).then(() => {
          alert('Order details copied to clipboard! Please open WhatsApp and paste the message.\n\nWhatsApp Number: +' + whatsappNumber);
        }).catch(() => {
          // If clipboard fails, show message directly
          alert(`WhatsApp couldn't open. Please copy this message and send it to +${whatsappNumber}:\n\n${message}`);
        });
      } else {
        // Fallback for older browsers
        alert(`WhatsApp couldn't open. Please copy this message and send it to +${whatsappNumber}:\n\n${message}`);
      }
    }
  };

  if (state.items.length === 0) {
    return (
      <MainLayout>
        <Head title="Shopping Cart" />
        
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-xl text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            
            <div className="space-y-4">
              <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
                <Link href="/shop">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Shopping
                </Link>
              </Button>
              
              {favoritesState.count > 0 && (
                <div>
                  <p className="text-gray-600 mb-2">Or check out your favorites:</p>
                  <Button asChild variant="outline">
                    <Link href="/dashboard">
                      <Heart className="mr-2 h-5 w-5" />
                      View Favorites ({favoritesState.count})
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head title="Shopping Cart" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">Review your items and proceed to checkout</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Cart Items ({state.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                          {item.size && (
                            <Badge variant="secondary" className="mt-1">
                              Size: {item.size}
                            </Badge>
                          )}
                          {item.color && (
                            <Badge variant="outline" className="mt-1 ml-2">
                              Color: {item.color}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.size || 'M', item.color || 'Default', Math.max(1, (item.quantity || 1) - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="w-12 text-center font-medium">
                            {item.quantity || 1}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.size || 'M', item.color || 'Default', (item.quantity || 1) + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            KES {(item.price * (item.quantity || 1)).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            KES {item.price.toLocaleString()} each
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id, item.size || 'M', item.color || 'Default')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Checkout */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Order Summary
                    {isLoggedIn && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Account Linked
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>KES {calculateSubtotal().toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={calculateShipping() === 0 ? 'text-green-600 font-medium' : ''}>
                        {calculateShipping() === 0 ? 'FREE' : `KES ${calculateShipping().toLocaleString()}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax (VAT)</span>
                      <span>KES {calculateTax().toLocaleString()}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>KES {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {calculateShipping() === 0 && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center text-green-800">
                        <Gift className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">
                          Free shipping on orders over {businessConfig.currencySymbol} {businessConfig.freeShippingThreshold.toLocaleString()}!
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Login Benefits */}
                  {!isLoggedIn && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center text-blue-800">
                        <Zap className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">
                          Login to save 10% on your first order!
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Smart User Status Card */}
              {isLoggedIn ? (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-green-900 mb-2">Welcome back, {currentUser.name}!</h3>
                      <p className="text-sm text-green-700 mb-4">
                        Your account details will be automatically used for this order
                      </p>
                      
                      {/* User Details Preview */}
                      <div className="text-left bg-white/50 rounded-lg p-3 mb-4">
                        <div className="flex items-center text-sm text-green-800 mb-2">
                          <User className="h-4 w-4 mr-2" />
                          <span className="font-medium">{currentUser.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-green-700 mb-2">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{currentUser.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-green-700 mb-2">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{currentUser.email}</span>
                        </div>
                        <div className="flex items-start text-sm text-green-700">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                          <span>{currentUser.address}</span>
                        </div>
                      </div>
                      
                      <Button asChild variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                        <Link href="/dashboard">
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <User className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-blue-900 mb-2">Login for Better Experience</h3>
                      <p className="text-sm text-blue-700 mb-4">
                        Save 10% on your first order + track all your orders
                      </p>
                      <Button asChild variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                        <Link href="/login">
                          <Zap className="mr-2 h-4 w-4" />
                          Quick Login
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* WhatsApp Checkout */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-900 mb-2">Checkout via WhatsApp</h3>
                    <p className="text-sm text-green-700 mb-4">
                      Fast, secure, and personal shopping experience
                    </p>
                    <Button
                      onClick={handleWhatsAppCheckout}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {isLoggedIn ? 'Checkout with Account Details' : 'Checkout on WhatsApp'}
                    </Button>
                    
                    {/* WhatsApp Number Display */}
                    <div className="mt-3 text-xs text-green-600">
                      WhatsApp: +{businessConfig.whatsappNumber}
                    </div>
                    
                    {/* Seamless Checkout Info */}
                    {isLoggedIn && (
                      <div className="mt-3 p-2 bg-green-100 rounded-lg">
                        <div className="flex items-center text-xs text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          <span>Your account details will be automatically included</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Test Button for Development */}
                    {process.env.NODE_ENV === 'development' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full border-green-300 text-green-700 hover:bg-green-100"
                        onClick={() => {
                          console.log('WhatsApp Message:', handleWhatsAppCheckout());
                        }}
                      >
                        Test WhatsApp (Dev)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-6 text-gray-500">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-1" />
                  <span className="text-xs">Free Shipping</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-xs">Secure Checkout</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span className="text-xs">Customer Love</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
