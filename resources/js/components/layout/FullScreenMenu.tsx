import React from 'react';
import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullScreenMenu({ isOpen, onClose }: FullScreenMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Top Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-12 py-6">
            {['WOMEN', 'MEN', 'KIDS', 'BABY'].map((category) => (
              <button
                key={category}
                className={`text-lg font-medium transition-colors ${
                  category === 'WOMEN' 
                    ? 'text-black border-b-2 border-black pb-2' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-black mb-6">SHOP WOMEN'S COLLECTION</h2>
            {[
              { name: 'Outerwear', image: '/images/chamly/8.jpg' },
              { name: 'T-Shirts, Sweats & Fleece', image: '/images/chamly/9.jpg' },
              { name: 'Innerwear & Underwear', image: '/images/chamly/10.jpg' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <span className="text-lg text-gray-800 group-hover:text-black transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="text-2xl text-gray-400 group-hover:text-black transition-colors">›</span>
              </div>
            ))}
          </div>

          {/* Middle Column */}
          <div className="space-y-8">
            {[
              { name: 'Bottoms', image: '/images/chamly/11.jpeg' },
              { name: 'Sweaters & Cardigans', image: '/images/chamly/12.jpeg' },
              { name: 'Accessories', image: '/images/chamly/13.jpeg' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <span className="text-lg text-gray-800 group-hover:text-black transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="text-2xl text-gray-400 group-hover:text-black transition-colors">›</span>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {[
              { name: 'Shirts & Blouses', image: '/images/chamly/14.jpeg' },
              { name: 'Dresses & Skirts', image: '/images/chamly/15.jpeg' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <span className="text-lg text-gray-800 group-hover:text-black transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="text-2xl text-gray-400 group-hover:text-black transition-colors">›</span>
              </div>
            ))}
            
            {/* Brand Section */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <img 
                    src="/images/chamly/logo.jpg" 
                    alt="Chamly Wears Logo" 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <span className="text-lg text-gray-800 group-hover:text-black transition-colors">
                    Chamly Wears home
                  </span>
                </div>
                <span className="text-2xl text-gray-400 group-hover:text-black transition-colors">›</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Close Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={onClose}
          className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-3"
        >
          <span className="text-lg font-medium">Close</span>
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
