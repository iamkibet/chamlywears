import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, Search, User, Heart, Sun, Moon, Settings, LogIn, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/common/Logo';
import { FullScreenMenu } from './FullScreenMenu';
import { useCart } from '@/components/common/CartProvider';
import { useFavorites } from '@/components/common/FavoritesProvider';
import { useTheme } from '@/components/common/ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  cartCount?: number;
  isMenuOpen?: boolean;
  setIsMenuOpen?: (isOpen: boolean) => void;
}

export function Navbar({ cartCount = 0, isMenuOpen = false, setIsMenuOpen }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { state, toggleCart } = useCart();
  const { state: favoritesState } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  
  // Get user data from Inertia page props
  const { auth } = usePage().props as any;
  const user = auth?.user;
  const isAdmin = user?.role === 'admin';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const openMenu = () => {
    if (setIsMenuOpen) {
      setIsMenuOpen(true);
    }
  };

  const handleLogout = () => {
    router.post('/logout');
  };

  const handleDashboardClick = () => {
    if (isAdmin) {
      router.visit('/admin/dashboard');
    } else {
      router.visit('/dashboard');
    }
  };

  return (
    <>
      {/* Minimal Top Bar */}
      <div className="bg-black text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center text-xs tracking-wider">
            <span>FREE SHIPPING ON ORDERS OVER KES 5,000</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Logo */}
            <div className="flex-shrink-0">
              <Logo showText={false} />
            </div>

            {/* Center - Main Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors tracking-wide"
              >
                HOME
              </Link>
              <Link
                href="/shop"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors tracking-wide"
              >
                SHOP
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors tracking-wide"
              >
                ABOUT
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors tracking-wide"
              >
                CONTACT
              </Link>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 h-9 text-sm border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </form>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-gray-700 hover:text-gray-900"
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>

              {/* User Account - Enhanced with dropdown menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 px-3 text-gray-700 hover:text-gray-900 relative group"
                    >
                      {/* Ring indicator when logged in */}
                      <div className="absolute inset-0 rounded-md ring-2 ring-green-500 ring-opacity-50 group-hover:ring-opacity-75 transition-all duration-200"></div>
                      <User className="h-4 w-4 relative z-10" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        {isAdmin && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Crown className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600 font-medium">Admin</span>
                          </div>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDashboardClick} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{isAdmin ? 'Admin Dashboard' : 'My Dashboard'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/products" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Products
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/orders" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Orders
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}

              {/* Wishlist - Only show when logged in and NOT admin */}
              {user && !isAdmin && (
                <Button variant="ghost" size="sm" className="h-9 px-3 text-gray-700 hover:text-gray-900 relative">
                  <Heart className="h-4 w-4" />
                  {favoritesState.count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {favoritesState.count}
                    </span>
                  )}
                </Button>
              )}

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-gray-700 hover:text-gray-900 relative"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {state.itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="lg:hidden bg-gray-50 border-b px-4 py-2">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 text-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </form>
      </div>

      {/* Full Screen Menu */}
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen?.(false)} />
    </>
  );
}
