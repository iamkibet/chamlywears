import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, User, Calendar, DollarSign, MapPin, Phone, Mail, ShoppingBag, Truck, CheckCircle, XCircle, Clock, Printer, Download, Share2 } from 'lucide-react';

interface OrderItem {
  id: number;
  product: {
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_number: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  total: number | null;
  subtotal: number | null;
  shipping: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  items: OrderItem[];
  notes?: string;
}

interface AdminOrderShowProps {
  order: Order;
}

export default function AdminOrderShow({ order }: AdminOrderShowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Awaiting Processing';
      case 'completed': return 'Order Completed';
      case 'cancelled': return 'Order Cancelled';
      default: return 'Unknown Status';
    }
  };

  // Safe number formatting
  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'KES 0.00';
    return `KES ${Number(value).toFixed(2)}`;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString: string): string => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      <Head title={`Order ${order.order_number} - Admin`} />
      
      <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0">
          {/* Header Actions - Hidden on Print */}
          <div className="mb-8 print:hidden">
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-3xl font-bold text-gray-900">
                Order {order.order_number || `#${order.id}`}
              </h1>
            </div>
            <p className="text-gray-600">
              Order placed on {formatDate(order.created_at)}
            </p>
          </div>

          {/* Receipt Container */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
            {/* Receipt Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center print:bg-white print:text-black">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">CHAMLY WEARS</h1>
                <p className="text-blue-100 print:text-gray-600">Fashion & Lifestyle</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm print:text-xs">
                <div className="text-left">
                  <p className="font-medium">Order Number:</p>
                  <p className="text-blue-100 print:text-gray-800">{order.order_number || `#${order.id}`}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Order Date:</p>
                  <p className="text-blue-100 print:text-gray-800">{formatShortDate(order.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-8 print:p-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Bill To:</h3>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{order.user?.name || 'Unknown Customer'}</p>
                    <p className="text-gray-600">{order.user?.email || 'No email'}</p>
                    {order.user?.phone && (
                      <p className="text-gray-600">{order.user.phone}</p>
                    )}
                    {order.user?.address && (
                      <p className="text-gray-600">{order.user.address}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Order Details:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{formatDate(order.created_at)}</span>
                    </div>
                    {order.completed_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="text-gray-900">{formatDate(order.completed_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Order Items:</h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Item</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Qty</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Unit Price</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  {item.product.image ? (
                                    <img 
                                      src={item.product.image} 
                                      alt={item.product.name}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <Package className="h-6 w-6 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{item.product.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center text-sm text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-4 text-right text-sm text-gray-900">
                              {formatCurrency(item.product.price)}
                            </td>
                            <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                              {formatCurrency(item.price)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>No items found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {/* Order Notes */}
                  {order.notes && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Order Notes:</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{order.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Order Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Order Timeline:</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Order Placed</p>
                          <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                      
                      {order.status === 'completed' && order.completed_at && (
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Order Completed</p>
                            <p className="text-xs text-gray-500">{formatDate(order.completed_at)}</p>
                          </div>
                        </div>
                      )}
                      
                      {order.status === 'cancelled' && (
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Order Cancelled</p>
                            <p className="text-xs text-gray-500">{formatDate(order.updated_at)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Order Summary:</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="text-gray-900">{formatCurrency(order.shipping)}</span>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-blue-600">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="bg-gray-50 p-6 text-center print:bg-white">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Thank you for your order!</p>
                <p className="text-xs text-gray-500">
                  For questions or support, please contact us at support@chamlywears.com
                </p>
              </div>
              <div className="text-xs text-gray-400">
                <p>Chamly Wears - Fashion & Lifestyle</p>
                <p>Order #{order.order_number || order.id} • {formatShortDate(order.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Hidden on Print */}
          <div className="mt-8 flex justify-center space-x-4 print:hidden">
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
