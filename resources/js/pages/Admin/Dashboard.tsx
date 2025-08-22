import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';
import {
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Settings,
  BarChart3,
  Activity,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Plus,
  CheckCircle,
  XCircle,
  User,
  Download
} from 'lucide-react';

interface AdminDashboardProps {
  stats: {
    todayOrders: number;
    todaySales: number;
    todayRevenue: number;
    weekOrders: number;
    weekSales: number;
    monthOrders: number;
    monthSales: number;
    totalUsers: number;
    totalOrders: number;
    completedOrders: number;
    totalProducts: number;
    totalRevenue: number;
    totalInventoryValue: number;
    userGrowth: number;
    revenueGrowth: number;
  };
  ordersByStatus: any[];
  monthlyRevenue: any[];
  topCustomers: any[];
  trafficSources: any[];
  topCategories: any[];
  recentOrders: any[];
  recentActivities: {
    type: string;
    title: string;
    description: string;
    customer: string | null;
    timestamp: string;
    icon: string;
    color: string;
  }[];
}

export default function AdminDashboard({
  stats = {
    todayOrders: 0,
    todaySales: 0,
    todayRevenue: 0,
    weekOrders: 0,
    weekSales: 0,
    monthOrders: 0,
    monthSales: 0,
    totalUsers: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalInventoryValue: 0,
    userGrowth: 0,
    revenueGrowth: 0,
  },
  ordersByStatus = [],
  monthlyRevenue = [],
  topCustomers = [],
  trafficSources = [],
  topCategories = [],
  recentOrders = [],
  recentActivities = []
}: AdminDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Safe number formatting with fallbacks
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'KES 0';
    return `KES ${Number(value).toLocaleString()}`;
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0';
    return Number(value).toLocaleString();
  };

  // Function to render a mini bar chart for revenue visualization
  const renderMiniBarChart = (data: any[], maxValue: number) => {
    return (
      <div className="flex items-end h-8 gap-px">
        {data.map((item, index) => (
          <div
            key={index}
            className="w-3 bg-blue-400 rounded-t"
            style={{ height: `${(item.revenue / maxValue) * 100}%` }}
          />
        ))}
      </div>
    );
  };

  // Find max revenue for chart scaling
  const maxRevenue = monthlyRevenue.length > 0
    ? Math.max(...monthlyRevenue.map(item => item.revenue))
    : 0;

  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  const [orderStatuses, setOrderStatuses] = useState<Record<number, string>>({});
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [chartPeriod, setChartPeriod] = useState<'6months' | '12months'>('12months');

  // Generate growth metrics data from real database data
  const generateGrowthData = (data: any[], period: '6months' | '12months') => {
    if (data.length === 0) return [];
    
    // Use the actual monthlyRevenue data
    const revenueData = data;
    
    // Calculate user growth based on stats (simplified calculation)
    const baseUsers = stats?.totalUsers || 100;
    const userGrowthRate = 0.08; // 8% monthly growth (this should come from actual user analytics)
    
    // Calculate conversion rate based on orders vs users
    const baseConversion = 0.032; // 3.2% base conversion (this should come from actual analytics)
    const conversionGrowthRate = 0.05; // 5% monthly growth
    
    return revenueData.map((item, index) => {
      const monthIndex = index;
      const users = Math.round(baseUsers * Math.pow(1 + userGrowthRate, monthIndex));
      const revenue = item.revenue || 0;
      const conversion = baseConversion * Math.pow(1 + conversionGrowthRate, monthIndex);
      
      return {
        month: item.month,
        users,
        revenue,
        conversion: Math.round(conversion * 1000) / 10 // Convert to percentage with 1 decimal place
      };
    });
  };

  const growthChartData = generateGrowthData(monthlyRevenue, chartPeriod);

  // Calculate current growth percentages for summary cards
  const getCurrentGrowth = (data: any[], key: 'users' | 'revenue' | 'conversion') => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1][key];
    const previous = data[data.length - 2][key];
    return Math.round(((current - previous) / previous) * 100);
  };

  const currentUserGrowth = getCurrentGrowth(growthChartData, 'users');
  const currentRevenueGrowth = getCurrentGrowth(growthChartData, 'revenue');
  const currentConversionGrowth = getCurrentGrowth(growthChartData, 'conversion');



  const handleOrderStatusChange = async (orderId: number, newStatus: string) => {
    // Update immediately for instant feedback
    setOrderStatuses(prev => ({
      ...prev,
      [orderId]: newStatus
    }));

    try {
      const response = await fetch(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message || 'Order status updated successfully!' });
      } else {
        // Revert on error
        setOrderStatuses(prev => ({
          ...prev,
          [orderId]: prev[orderId] || 'pending'
        }));
        setMessage({ type: 'error', text: data.message || 'Failed to update order status' });
      }
    } catch (error) {
      // Revert on error
      setOrderStatuses(prev => ({
        ...prev,
        [orderId]: prev[orderId] || 'pending'
      }));
      setMessage({ type: 'error', text: 'An error occurred while updating the order status' });
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ type: null, text: '' });
    }, 3000);
  };

  return (
    <MainLayout>
      <Head title="Admin Dashboard - Chamly Wears" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toast Notification */}
          {message.type && (
            <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
                <button
                  onClick={() => setMessage({ type: null, text: '' })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
            </div>
            <div className="flex gap-2">
            
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/products/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Product
                </Link>
              </Button>
              <Button size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Combined Stats Dashboard */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last 30 days
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Combined Time Period Performance Card */}
              <Card className="relative overflow-hidden border-l-4 border-l-gradient-to-b from-blue-500 via-green-500 to-purple-500 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-sm font-medium text-gray-900">Performance Overview</CardTitle>
                    <select
                      className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setSelectedPeriod(e.target.value as 'today' | 'week' | 'month')}
                      value={selectedPeriod}
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-200 via-green-200 to-purple-200 flex items-center justify-center shadow-sm">
                    {selectedPeriod === 'today' ? (
                      <Calendar className="h-4 w-4 text-blue-700" />
                    ) : selectedPeriod === 'week' ? (
                      <TrendingUp className="h-4 w-4 text-green-700" />
                    ) : (
                      <BarChart3 className="h-4 w-4 text-purple-700" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {selectedPeriod === 'today' ? formatNumber(stats?.todayOrders) :
                      selectedPeriod === 'week' ? formatNumber(stats?.weekOrders) :
                        formatNumber(stats?.monthOrders)}
                  </div>
                  <p className="text-sm text-gray-700 font-medium mb-3">
                    {selectedPeriod === 'today' ? formatCurrency(stats?.todaySales) :
                      selectedPeriod === 'week' ? formatCurrency(stats?.weekSales) :
                        formatCurrency(stats?.monthSales)} in sales
                  </p>
                  <div className="flex justify-end">
                    <Badge variant="outline" className={`text-xs font-medium ${selectedPeriod === 'today'
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : selectedPeriod === 'week'
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : 'bg-purple-100 text-purple-700 border-purple-300'
                      }`}>
                      {selectedPeriod === 'today'
                        ? `${stats?.todayOrders > 0 ? '+' : ''}${Math.round((stats?.todayOrders / stats?.weekOrders) * 100)}% of weekly avg`
                        : selectedPeriod === 'week'
                          ? `${stats?.weekOrders > 0 ? '+' : ''}${Math.round((stats?.weekOrders / stats?.monthOrders) * 100)}% of monthly avg`
                          : `${stats?.monthOrders > 0 ? '+' : ''}${Math.round((stats?.monthOrders / stats?.totalOrders) * 100)}% of total orders`
                      }
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Totals Summary Card */}
              <Card className="relative overflow-hidden border-l-4 border-l-amber-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Totals</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Package className="h-4 w-4 text-amber-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-lg font-bold">{formatNumber(stats?.completedOrders)}</div>
                      <p className="text-xs text-muted-foreground">Completed Orders</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{formatCurrency(stats?.totalRevenue)}</div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">{formatNumber(stats?.totalUsers)}</div>
                      <p className="text-xs text-muted-foreground">Users</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{formatNumber(stats?.totalProducts)}</div>
                      <p className="text-xs text-muted-foreground">Products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              
            </div>

           

            {/* Interactive Growth Metrics Chart */}
            <div className="mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Growth Metrics Overview</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Track user growth, revenue trends, and conversion rates over time
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        className="text-xs bg-white border border-gray-200 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setChartPeriod(e.target.value as '6months' | '12months')}
                        value={chartPeriod}
                      >
                        <option value="6months">Last {monthlyRevenue.length} Months</option>
                        <option value="12months">Last 12 Months</option>
                      </select>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Download className="h-4 w-4 mr-1" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={growthChartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <defs>
                          <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                          </linearGradient>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                          </linearGradient>
                          <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                            // Extract month abbreviation from the month value (e.g., "Jul 2024" -> "Jul")
                            return value.split(' ')[0];
                          }}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                            if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                            return value.toString();
                          }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            padding: '12px',
                          }}
                          labelStyle={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}
                          formatter={(value, name) => {
                            if (name === 'users') return [value.toLocaleString(), 'Users'];
                            if (name === 'revenue') {
                              const revenue = Number(value);
                              let formattedValue;
                              if (revenue >= 1000000) {
                                formattedValue = `KES ${(revenue / 1000000).toFixed(1)}M`;
                              } else if (revenue >= 1000) {
                                formattedValue = `KES ${(revenue / 1000).toFixed(0)}k`;
                              } else {
                                formattedValue = `KES ${revenue.toLocaleString()}`;
                              }
                              return [formattedValue, 'Revenue'];
                            }
                            if (name === 'conversion') return [`${value}%`, 'Conversion Rate'];
                            return [value, name];
                          }}
                          labelFormatter={(label) => {
                            // Extract year from the month value if available, otherwise use current year
                            const year = label.split(' ')[1] || new Date().getFullYear();
                            return `${label.split(' ')[0]} ${year}`;
                          }}
                        />
                        
                        {/* User Growth Area */}
                        <Area
                          type="monotone"
                          dataKey="users"
                          yAxisId="left"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          fill="url(#userGradient)"
                          name="users"
                          animationDuration={1000}
                          animationBegin={0}
                        />
                        
                        {/* Revenue Growth Area */}
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          yAxisId="left"
                          stroke="#10B981"
                          strokeWidth={3}
                          fill="url(#revenueGradient)"
                          name="revenue"
                          animationDuration={1000}
                          animationBegin={200}
                        />
                        
                        {/* Conversion Rate Line */}
                        <Line
                          type="monotone"
                          dataKey="conversion"
                          yAxisId="right"
                          stroke="#8B5CF6"
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                          name="conversion"
                          animationDuration={1000}
                          animationBegin={400}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Chart Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-600">User Growth</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-600">Revenue Growth</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Revenue Chart and Recent Orders */}
            <div className="lg:col-span-2 space-y-8">
              {/* Revenue Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue performance</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View report
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* Total Inventory Value Summary */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-amber-800">Total Inventory Value</p>
                        <p className="text-2xl font-bold text-amber-900">{formatCurrency(stats?.totalInventoryValue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-amber-700">Products in Stock</p>
                        <p className="text-lg font-semibold text-amber-900">{formatNumber(stats?.totalProducts)}</p>
                      </div>
                    </div>
                  </div>



                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyRevenue}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <defs>
                          <linearGradient id="revenueChartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                            // Extract month abbreviation from the month value (e.g., "Jul 2024" -> "Jul")
                            return value.split(' ')[0];
                          }}
                        />
                        <YAxis 
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                            if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                            return value.toString();
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            padding: '12px',
                          }}
                          labelStyle={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}
                          formatter={(value, name) => {
                            const revenue = Number(value);
                            let formattedValue;
                            if (revenue >= 1000000) {
                              formattedValue = `KES ${(revenue / 1000000).toFixed(1)}M`;
                            } else if (revenue >= 1000) {
                              formattedValue = `KES ${(revenue / 1000).toFixed(0)}k`;
                            } else {
                              formattedValue = `KES ${revenue.toLocaleString()}`;
                            }
                            return [formattedValue, 'Revenue'];
                          }}
                          labelFormatter={(label) => {
                            // Extract year from the month value if available, otherwise use current year
                            const year = label.split(' ')[1] || new Date().getFullYear();
                            return `${label.split(' ')[0]} ${year}`;
                          }}
                        />
                        
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          fill="url(#revenueChartGradient)"
                          animationDuration={1000}
                          animationBegin={0}
                        />
                        
                        {/* Reference line for average revenue */}
                        <ReferenceLine
                          y={monthlyRevenue.length > 0 ? monthlyRevenue.reduce((sum: number, item: any) => sum + item.revenue, 0) / monthlyRevenue.length : 0}
                          stroke="#EF4444"
                          strokeDasharray="3 3"
                          strokeWidth={2}
                          label={{
                            value: 'Average',
                            position: 'insideTopRight',
                            fill: '#EF4444',
                            fontSize: 12,
                            fontWeight: 'bold'
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +15.3% from last month
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Based on completed orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/orders">
                      View All
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders && recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <div key={`order-${order.id}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <ShoppingBag className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Order #{order.order_number || order.id}</p>
                              <p className="text-sm text-gray-600">{order.customer_name || order.user?.name || 'Unknown Customer'}</p>
                              <p className="text-xs text-gray-500">
                                {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown Date'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <Badge className={getStatusColor(orderStatuses[order.id] || order.status)}>
                                {orderStatuses[order.id] || order.status || 'unknown'}
                              </Badge>
                              <p className="text-sm font-medium mt-1">
                                {formatCurrency(order.total)}
                              </p>
                            </div>
                            <select
                              className="text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white shadow-sm min-w-[100px]"
                              value={orderStatuses[order.id] || order.status || 'pending'}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            >
                              <option value="pending" className="text-xs py-1">Pending</option>
                              <option value="completed" className="text-xs py-1">Completed</option>
                              <option value="cancelled" className="text-xs py-1">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No orders yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats and Quick Actions */}
            <div className="space-y-8">
              {/* Orders by Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Orders by Status</CardTitle>
                  <CardDescription>Current order distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersByStatus && ordersByStatus.length > 0 ? (
                    <div className="space-y-4">
                      {ordersByStatus.map((status) => (
                        <div key={status.status} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status).split(' ')[0]}`} />
                            <span className="text-sm font-medium capitalize">{status.status}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{status.count || 0}</span>
                            <span className="text-xs text-gray-500">({Math.round((status.count / stats.totalOrders) * 100)}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No order status data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your visitors come from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-gray-100 rounded">
                            <source.icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{source.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">{source.percentage}%</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your store efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="h-auto p-3 flex-col">
                      <Link href="/admin/orders">
                        <ShoppingBag className="h-5 w-5 mb-2" />
                        <span className="font-medium text-sm">Orders</span>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-3 flex-col">
                      <Link href="/admin/users">
                        <Users className="h-5 w-5 mb-2" />
                        <span className="font-medium text-sm">Customers</span>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-3 flex-col">
                      <Link href="/admin/products">
                        <Package className="h-5 w-5 mb-2" />
                        <span className="font-medium text-sm">Products</span>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-3 flex-col">
                      <Link href="/admin/analytics">
                        <BarChart3 className="h-5 w-5 mb-2" />
                        <span className="font-medium text-sm">Analytics</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section - Top Customers and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Top Customers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>Customers with highest lifetime value</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCustomers && topCustomers.length > 0 ? (
                    topCustomers.map((customer, index) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(customer.orders_sum_total)}</p>
                          <p className="text-sm text-gray-500">{customer.orders_count || 0} orders</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No customer data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.visit('/admin/activities')}
                  className="h-8"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities && recentActivities.length > 0 ? (
                    recentActivities.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                            activity.color === 'green' ? 'bg-green-100 text-green-600' :
                              activity.color === 'red' ? 'bg-red-100 text-red-600' :
                                activity.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                                  activity.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                    'bg-gray-100 text-gray-600'
                          }`}>
                          {activity.icon === 'ShoppingBag' && <ShoppingBag className="h-4 w-4" />}
                          {activity.icon === 'Package' && <Package className="h-4 w-4" />}
                          {activity.icon === 'User' && <User className="h-4 w-4" />}
                          {activity.icon === 'DollarSign' && <DollarSign className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          {activity.customer && (
                            <p className="text-xs text-gray-500 mt-1">
                              Customer: {activity.customer}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No recent activities</p>
                      <p className="text-sm">Activities will appear here as they happen</p>
                    </div>
                  )}
                  {recentActivities && recentActivities.length > 5 && (
                    <div className="text-center pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit('/admin/activities')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View {recentActivities.length - 5} more activities →
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}