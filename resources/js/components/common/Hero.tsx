import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  onExploreClick?: () => void;
}

export function Hero({ 
  title = "2025 FALL / WINTER",
  subtitle = "Revisiting Classic",
  backgroundImage,
  onExploreClick 
}: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage || '/images/chamly/22.png'})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* LifeWear Badge */}
        <div className="mb-8">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/30">
            LifeWear COLLECTION
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl font-serif italic mb-12 text-gray-200">
          {subtitle}
        </p>

        {/* Explore Collection Button */}
        <Button
          onClick={onExploreClick}
          className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all duration-300 px-8 py-4 text-lg font-medium rounded-full group"
        >
          <span>Explore the collection</span>
          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-white/20 text-sm font-mono tracking-widest transform -rotate-90">
        CHAMLY WEARS
      </div>
      <div className="absolute bottom-20 right-10 text-white/20 text-sm font-mono tracking-widest transform rotate-90">
        EST. 2024
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-20 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 left-20 w-1 h-1 bg-white/20 rounded-full animate-ping" />
      <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-1000" />
    </section>
  );
}
