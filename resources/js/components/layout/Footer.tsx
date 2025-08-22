import React from 'react';
import { Link } from '@inertiajs/react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Logo size="lg" className="mb-4" />
            <p className="text-gray-300 mb-4">
              Modern Wear for the Whole Family. Look Good. Feel Unstoppable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/shop?category=casual" className="text-gray-300 hover:text-white">
                  Casual Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gym" className="text-gray-300 hover:text-white">
                  Gym Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=official" className="text-gray-300 hover:text-white">
                  Official Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact & Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-gray-300 hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-gray-300 hover:text-white">
                  Shipping
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Chamly Wears. All rights reserved.
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Nairobi | Eldoret | Nakuru | Mombasa</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                <span>+254 705 659 518</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@chamlywears.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
