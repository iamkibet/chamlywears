import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  User, 
  MessageCircle, 
  Loader2,
  CheckCircle,
  Truck
} from 'lucide-react';
import { useCart } from '@/components/common/CartProvider';
import { businessConfig } from '@/config/business';

export default function Checkout() {
  const { state, clearCart } = useCart();
  
  // Get user data from Inertia page props
  const { auth } = usePage().props as any;
  const user = auth?.user;
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const hasAllRequiredDetails = (f: any) => {
    return [f.firstName, f.lastName, f.email, f.phone, f.street, f.city].every((v) => !!(v && String(v).trim()));
  };

  const needsMoreInfo = !hasAllRequiredDetails(checkoutForm);

  // Auto-fill form with user data when logged in
  useEffect(() => {
    if (user) {
      setCheckoutForm({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address || '',
        city: user.city || 'Nairobi',
        postalCode: user.postal_code || '',
        notes: ''
      });
    }
  }, [user]);

  // If no user, redirect to login
  if (!user) {
    return (
      <MainLayout>
        <Head title="Checkout - Chamly Wears" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in to complete your checkout</p>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (state.items.length === 0) {
    return (
      <MainLayout>
        <Head title="Checkout - Chamly Wears" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart before checkout</p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const subtotal = state.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = 0; // Shipping disabled for now
  const total = subtotal + shipping; // VAT removed

  const handleWhatsAppCheckout = async () => {
    if (isCheckingOut) return;
    
    setIsCheckingOut(true);
    
    // Debug: Check authentication and CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    console.log('CSRF Token:', csrfToken);
    console.log('User authenticated:', !!user);
    console.log('User data:', user);
    
    try {
      // Create order first
      const orderData = {
        cart_items: state.items.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          slug: item.slug || `product-${item.id}`,
          size: item.size || 'N/A',
          color: item.color || 'N/A',
          price: item.price,
          quantity: item.quantity || 1,
        })),
        customer_info: checkoutForm,
        totals: {
          subtotal: subtotal,
          shipping: shipping,
          total: total,
        }
      };

      console.log('Order data being sent:', orderData);

      const response = await fetch('/orders/create-from-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(orderData),
        credentials: 'same-origin', // Include cookies/session
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Handle auth/session errors explicitly
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (response.status === 419) {
        throw new Error('Session expired. Please refresh the page and try again.');
      }
      if (response.status === 422) {
        let details = 'Validation failed. Please check your details and try again.';
        try {
          const data = await response.json();
          if (data?.message) details = data.message;
          if (data?.errors) {
            const messages = Object.values(data.errors).flat().join('\n');
            if (messages) details = messages;
          }
        } catch (_) {}
        throw new Error(details);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response received:', responseText);
        
        // Check if it's a login page
        if (responseText.toLowerCase().includes('login')) {
          throw new Error('Authentication required. Please log in again.');
        }
        
        throw new Error('Server returned non-JSON response. Please try again or contact support.');
      }

      const result = await response.json();
      
      if (result.success) {
        setCreatedOrder(result.order);
        setOrderCreated(true);
        
        // Clear cart after successful order creation
        clearCart();
        
        // Generate WhatsApp message with order details
        const orderItems = state.items.map(item => {
          const productUrl = `${window.location.origin}/product/${item.slug || `product-${item.id}`}`;
          return `• ${item.name} (${item.size || 'N/A'}, ${item.color || 'N/A'}) - KES ${item.price.toLocaleString()} x${item.quantity || 1}\n  🔗 ${productUrl}`;
        }).join('\n');

        const message = `🛍️ *NEW ORDER - Chamly Wears*\n\n` +
          `*Order Details:*\n` +
          `📋 Order #: ${result.order.order_number}\n` +
          `📅 Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}\n\n` +
          `*Customer Information:*\n` +
          `👤 Name: ${checkoutForm.firstName} ${checkoutForm.lastName}\n` +
          `📧 Email: ${checkoutForm.email}\n` +
          `📱 Phone: ${checkoutForm.phone}\n` +
          `📍 Address: ${checkoutForm.street}, ${checkoutForm.city} ${checkoutForm.postalCode}\n\n` +
          `*Order Items:*\n${orderItems}\n\n` +
          `*Order Summary:*\n` +
          `💰 Subtotal: KES ${subtotal.toLocaleString()}\n` +
          `🚚 Shipping: KES ${shipping.toFixed(2)}\n` +
          `💳 *Total: KES ${total.toLocaleString()}*\n\n` +
          `📝 Notes: ${checkoutForm.notes || 'None'}\n\n` +
          `*Next Steps:*\n` +
          `Please confirm this order and provide payment details. I'm ready to complete the purchase.\n\n` +
          `Thank you! 🙏`;

        // Create WhatsApp deep link
        const whatsappUrl = `https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp
        try {
          const newWindow = window.open(whatsappUrl, '_blank');
          if (!newWindow) {
            window.location.href = whatsappUrl;
          }
        } catch (error) {
          console.error('Error opening WhatsApp:', error);
          alert('WhatsApp couldn\'t open. Please copy the order details and send them manually.');
        }
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(error?.message || 'Failed to create order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <MainLayout>
      <Head title="Checkout - Chamly Wears" />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
            <p className="text-lg text-gray-600">Complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Items */}
                    {state.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600">
                            {item.size} • {item.color} • Qty: {item.quantity || 1}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            KES {(item.price * (item.quantity || 1)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>KES {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>KES {shipping.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>KES {total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* WhatsApp Checkout Button */}
                    <Button
                      onClick={handleWhatsAppCheckout}
                      disabled={isCheckingOut || needsMoreInfo}
                      className={`w-full text-white ${
                        needsMoreInfo 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                      size="lg"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating Order...
                        </>
                      ) : needsMoreInfo ? (
                        <>
                          <User className="mr-2 h-5 w-5" />
                          Complete Profile to Checkout
                        </>
                      ) : (
                        <>
                          <MessageCircle className="mr-2 h-5 w-5" />
                          Checkout via WhatsApp
                        </>
                      )}
                    </Button>

                    {/* Profile Completion Notice */}
                    {needsMoreInfo && (
                      <div className="text-center text-sm text-gray-600">
                        <p>Please complete your profile information to proceed with checkout.</p>
                        <Button asChild variant="link" size="sm" className="mt-1">
                          <Link href="/settings/profile">Go to Profile</Link>
                        </Button>
                      </div>
                    )}

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center space-x-6 text-gray-500 text-xs">
                      <div className="flex items-center">
                        <Truck className="h-3 w-3 mr-1" />
                        <span>Secure</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        <span>Trusted</span>
                      </div>
                    </div>
                    
                    {/* Order Success Message */}
                    {orderCreated && createdOrder && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center text-green-800">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">Order Created Successfully!</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Order #{createdOrder.order_number} has been created and sent to WhatsApp.
                        </p>
                        <div className="mt-3 space-y-2">
                          <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
                            <Link href="/dashboard?tab=orders">
                              View Orders
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/shop">
                              Continue Shopping
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Customer Information
                  </CardTitle>
                  <CardDescription>
                    Your profile information will be used for this order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {needsMoreInfo ? (
                    <div className="space-y-4">
                      {/* Incomplete Profile Warning */}
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800">
                              Profile Incomplete
                            </h3>
                            <div className="mt-2 text-sm text-amber-700">
                              <p>Your profile is missing required information for checkout. Please update your profile to continue.</p>
                              <div className="mt-3">
                                <p className="font-medium">Missing fields:</p>
                                <ul className="mt-1 list-disc list-inside space-y-1">
                                  {!checkoutForm.firstName && <li>First Name</li>}
                                  {!checkoutForm.lastName && <li>Last Name</li>}
                                  {!checkoutForm.email && <li>Email</li>}
                                  {!checkoutForm.phone && <li>Phone</li>}
                                  {!checkoutForm.street && <li>Street Address</li>}
                                  {!checkoutForm.city && <li>City</li>}
                                </ul>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                                <Link href="/settings/profile">
                                  Update Profile
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Complete Profile Display */}
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">
                              Profile Complete ✓
                            </h3>
                            <p className="mt-1 text-sm text-green-700">
                              All required information is available for your order.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Information Display */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</Label>
                          <p className="mt-1 text-sm text-gray-900">{checkoutForm.firstName} {checkoutForm.lastName}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</Label>
                          <p className="mt-1 text-sm text-gray-900">{checkoutForm.email}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</Label>
                          <p className="mt-1 text-sm text-gray-900">{checkoutForm.phone}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">City</Label>
                          <p className="mt-1 text-sm text-gray-900">{checkoutForm.city}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</Label>
                          <p className="mt-1 text-sm text-gray-900">
                            {checkoutForm.street}
                            {checkoutForm.postalCode && `, ${checkoutForm.postalCode}`}
                          </p>
                        </div>
                      </div>

                      {/* Edit Profile Link */}
                      <div className="pt-4 border-t border-gray-200">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/settings/profile">
                            Edit Profile Information
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Order Notes */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Order Notes</CardTitle>
                  <CardDescription>
                    Add any special instructions or notes for your order (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={checkoutForm.notes}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="e.g., Please call before delivery, Special packaging instructions, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
