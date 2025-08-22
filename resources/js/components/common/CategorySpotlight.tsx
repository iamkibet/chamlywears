import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface CategorySpotlightProps {
  title: string;
  subtitle: string;
  categories: Category[];
}

export function CategorySpotlight({ title, subtitle, categories }: CategorySpotlightProps) {
  const categoryData = [
    {
      name: 'Casual',
      description: 'Off-duty ease',
      image: '/images/chamly/8.jpg',
      link: '/shop?category=casual',
      color: 'from-blue-500 to-purple-600',
      accent: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Gym',
      description: 'Performance-ready',
      image: '/images/chamly/9.jpg',
      link: '/shop?category=gym',
      color: 'from-green-500 to-blue-600',
      accent: 'bg-green-100 text-green-800',
    },
    {
      name: 'Official',
      description: 'Boardroom sharp',
      image: '/images/chamly/10.jpg',
      link: '/shop?category=official',
      color: 'from-gray-600 to-slate-800',
      accent: 'bg-gray-100 text-gray-800',
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white text-gray-600 rounded-full px-6 py-2 mb-6">
            <span className="text-sm font-medium tracking-wide">SHOP BY CATEGORY</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryData.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Background Image */}
              <div className="relative h-96">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-90`} />
                
                {/* Category Badge */}
                <div className={`absolute top-6 left-6 ${category.accent} px-4 py-2 rounded-full text-sm font-semibold`}>
                  {category.name}
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <h3 className="text-3xl font-serif font-bold mb-3">{category.name}</h3>
                  <p className="text-xl text-gray-200 mb-6 font-light">{category.description}</p>
                  
                  {/* CTA Button */}
                  <Link
                    href={category.link}
                    className="inline-flex items-center text-white hover:text-gray-200 transition-all duration-300 group/btn"
                  >
                    <span className="mr-3 text-lg font-medium">Shop Now</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link href="/shop">
            <button className="inline-flex items-center space-x-3 bg-gray-900 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors duration-300 transform hover:-translate-y-1">
              <span>View All Categories</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
