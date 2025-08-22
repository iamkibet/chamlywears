import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Categories, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings,
  Home
} from 'lucide-react';

interface AdminNavigationProps {
  currentPage?: string;
}

export function AdminNavigation({ currentPage = 'dashboard' }: AdminNavigationProps) {
  const { auth } = usePage().props as any;
  const user = auth?.user;

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: currentPage === 'dashboard'
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      current: currentPage === 'products'
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: Categories,
      current: currentPage === 'categories'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingBag,
      current: currentPage === 'orders'
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: Users,
      current: currentPage === 'customers'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: currentPage === 'analytics'
    },
    {
      name: 'Content',
      href: '/admin/content/home',
      icon: Settings,
      current: currentPage === 'content'
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Navigation */}
          <nav className="flex space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    item.current
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Link>
            </Button>
            
            <div className="text-sm text-gray-700">
              Welcome, <span className="font-medium">{user?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
