import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  Truck, 
  User, 
  Settings,
  ArrowRight,
  Eye,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Plus,
  Minus,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { useCart } from '@/components/common/CartProvider';
import { useFavorites } from '@/components/common/FavoritesProvider';
import { Link } from '@inertiajs/react';

export default function Dashboard() {
  const { state: cartState, addToCart } = useCart();
  const { state: favoritesState, removeFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get user data from Inertia page props
  const { auth } = usePage().props as any;
  const user = auth?.user;
  
  const handleWhatsAppCompletion = async (order: any) => {
    try {
      const response = await fetch(`/orders/${order.id}/whatsapp-message`);
      const result = await response.json();
      
      if (result.whatsapp_url) {
        window.open(result.whatsapp_url, '_blank');
      }
    } catch (error) {
      console.error('Error generating WhatsApp message:', error);
      alert('Failed to generate WhatsApp message. Please try again.');
    }
  };
  
  // Handle URL parameters for tab switching and admin redirect
  useEffect(() => {
    // Check if user is admin and redirect to admin dashboard
    if (user && (user.role === 'admin' || user.is_admin === true)) {
      router.visit('/admin/dashboard');
      return;
    }
    
    // Handle URL parameters for tab switching
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'orders', 'favorites', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [user]);
  
  // If no user, redirect to login
  if (!user) {
    return (
      <MainLayout>
        <Head title="Dashboard" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Get real orders from user
  const orders = user?.orders || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <Truck className="h-4 w-4" />;
      case 'cancelled': return <Package className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      <Head title="Dashboard" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">Here's what's happening with your account</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            {user && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{favoritesState.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {favoritesState.count > 0 ? `${favoritesState.count} items` : 'No items yet'}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter((order: any) => order.status === 'processing').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  In progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter((order: any) => order.status === 'delivered').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully delivered
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                              <TabsList className={`grid w-full ${user ? 'grid-cols-4' : 'grid-cols-3'}`}>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    {user && <TabsTrigger value="favorites">Favorites</TabsTrigger>}
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                  </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>
                      Your latest orders and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{order.items.join(', ')}</p>
                            <p className="text-xs text-gray-500">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                            <p className="text-sm font-medium mt-1">KES {order.total.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link href="/dashboard?tab=orders">
                        View All Orders
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks and shortcuts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Update Profile
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/dashboard?tab=favorites">
                          <Heart className="mr-2 h-4 w-4" />
                          View Wishlist ({favoritesState.count})
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/shop">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Continue Shopping
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          Account Settings
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest account activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Order #12345 placed</p>
                        <p className="text-xs text-gray-600">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Added item to wishlist</p>
                        <p className="text-xs text-gray-600">1 day ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Order #12344 delivered</p>
                        <p className="text-xs text-gray-600">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    Track all your orders and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                        <Button asChild>
                          <Link href="/shop">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Start Shopping
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      orders.map((order: any) => (
                        <div key={order.id} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">Order #{order.order_number || order.id}</h3>
                              <p className="text-sm text-gray-600">
                                Placed on {new Date(order.created_at || order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Items</p>
                              <p className="text-sm text-gray-600">
                                {order.items?.map((item: any) => item.product_name || item).join(', ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Total</p>
                              <p className="text-sm text-gray-600">KES {(order.total || 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Status</p>
                              <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                            {order.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleWhatsAppCompletion(order)}
                                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Complete on WhatsApp
                              </Button>
                            )}
                            {order.status === 'processing' && (
                              <Button variant="outline" size="sm">
                                <Truck className="mr-2 h-4 w-4" />
                                Track Order
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab - Only show when logged in */}
            {user && (
              <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wishlist</CardTitle>
                  <CardDescription>
                    Items you've liked and saved for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favoritesState.items.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                      <p className="text-gray-600 mb-4">Start adding items you love to your wishlist</p>
                      <Button asChild>
                        <Link href="/shop">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Start Shopping
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoritesState.items.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden group">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFavorite(item.id)}
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600"
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                            <p className="text-lg font-bold text-gray-900 mb-3">
                              KES {item.price.toLocaleString()}
                            </p>
                            
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                                                 onClick={() => addToCart({
                                   id: item.id,
                                   name: item.name,
                                   price: item.price,
                                   image: item.image,
                                   category: item.category,
                                   size: 'M',
                                   color: 'Default'
                                 })}
                              >
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Add to Cart
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            )}

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                                         {/* Personal Info */}
                     <div>
                       <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                           <p className="text-gray-900">{user.name || 'Not provided'}</p>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                           <p className="text-gray-900">{user.email || 'Not provided'}</p>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                           <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                           <p className="text-gray-900">{user.city || 'Nairobi, Kenya'}</p>
                         </div>
                       </div>
                       <Button asChild variant="outline" className="mt-4">
                         <Link href="/profile">
                           <Edit3 className="mr-2 h-4 w-4" />
                           Edit Profile
                         </Link>
                       </Button>
                     </div>

                                         {/* Addresses */}
                     <div>
                       <h3 className="text-lg font-medium mb-4">Shipping Addresses</h3>
                       {user.address ? (
                         <div className="border rounded-lg p-4">
                           <div className="flex items-start justify-between">
                             <div>
                               <p className="font-medium">Primary Address</p>
                               <p className="text-sm text-gray-600">{user.address}</p>
                               <p className="text-sm text-gray-600">{user.city || 'Nairobi'}, Kenya</p>
                             </div>
                             <Button asChild variant="outline" size="sm">
                               <Link href="/profile">
                                 <Edit3 className="mr-2 h-4 w-4" />
                                 Edit
                               </Link>
                             </Button>
                           </div>
                         </div>
                       ) : (
                         <div className="border rounded-lg p-4 text-center text-gray-500">
                           <p>No address provided</p>
                         </div>
                       )}
                       <Button asChild variant="outline" className="mt-4">
                         <Link href="/profile">
                           <Plus className="mr-2 h-4 w-4" />
                           {user.address ? 'Add New Address' : 'Add Address'}
                         </Link>
                       </Button>
                     </div>

                    {/* Preferences */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Email Notifications</span>
                          <Badge variant="secondary">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>SMS Notifications</span>
                          <Badge variant="outline">Disabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Marketing Emails</span>
                          <Badge variant="outline">Disabled</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
