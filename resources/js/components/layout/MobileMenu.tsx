import React from 'react';
import { X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const categories = [
    { name: 'Casual', href: '/shop?category=casual' },
    { name: 'Gym', href: '/shop?category=gym' },
    { name: 'Official', href: '/shop?category=official' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed left-0 top-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100"
                    onClick={onClose}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100"
                    onClick={onClose}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth Links */}
            <div className="pt-6 border-t">
              <div className="space-y-3">
                <Link href="/login" className="w-full" onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="w-full" onClick={onClose}>
                  <Button className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Contact
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Phone: +254 705 659 518</p>
                <p>Email: info@chamlywears.com</p>
                <p>Locations: Nairobi, Eldoret, Nakuru, Mombasa</p>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
