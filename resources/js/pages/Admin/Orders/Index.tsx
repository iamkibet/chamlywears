import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Package, User, Calendar, DollarSign, Plus, TrendingUp } from 'lucide-react';

interface OrderItem {
  id: number;
  product: {
    name: string;
    image: string;
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
  };
  total: number | null;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface AdminOrdersProps {
  orders: {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats?: {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
  };
}

export default function AdminOrders({ orders, stats }: AdminOrdersProps) {
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
      case 'pending': return <Package className="h-4 w-4" />;
      case 'completed': return <Package className="h-4 w-4" />;
      case 'cancelled': return <Package className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  // Safe number formatting
  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'KES 0.00';
    return `KES ${Number(value).toFixed(2)}`;
  };

  // Calculate stats from orders if not provided
  const calculatedStats = stats || {
    totalRevenue: orders.data.reduce((sum, order) => sum + (order.total || 0), 0),
    totalOrders: orders.total,
    completedOrders: orders.data.filter(order => order.status === 'completed').length,
    cancelledOrders: orders.data.filter(order => order.status === 'cancelled').length,
    pendingOrders: orders.data.filter(order => order.status === 'pending').length,
  };

  return (
    <MainLayout>
      <Head title="Orders Management - Admin" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-gray-600">Track and manage customer orders</p>
            </div>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/admin/orders/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculatedStats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  All time orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(calculatedStats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  From all orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{calculatedStats.completedOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully fulfilled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{calculatedStats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{calculatedStats.cancelledOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Cancelled orders
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                Manage customer orders and track their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Order #</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.data.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{order.order_number || `#${order.id}`}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{order.user?.name || 'Unknown Customer'}</div>
                              <div className="text-sm text-gray-500">{order.user?.email || 'No email'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(order.status || 'unknown')}>
                            {getStatusIcon(order.status || 'unknown')}
                            <span className="ml-1 capitalize">{order.status || 'unknown'}</span>
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown Date'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {orders.last_page > 1 && (
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Showing {((orders.current_page - 1) * orders.per_page) + 1} to{' '}
                    {Math.min(orders.current_page * orders.per_page, orders.total)} of{' '}
                    {orders.total} results
                  </div>
                  <div className="flex space-x-2">
                    {orders.current_page > 1 && (
                      <Button variant="outline" size="sm">
                        Previous
                      </Button>
                    )}
                    {orders.current_page < orders.last_page && (
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                      )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
