import React from 'react';

interface AppLogoProps {
  showText?: boolean;
  text?: string;
  className?: string;
}

export default function AppLogo({ 
  showText = true, 
  text = 'Chamly Wears',
  className = '' 
}: AppLogoProps) {
  return (
    <>
      <div className={`flex items-center justify-center ${className}`}>
        <img 
          src="/images/chamly/logo.jpg" 
          alt="Chamly Wears Logo" 
          className="h-16 w-16 rounded-lg object-cover"
        />
      </div>
      {showText && (
        <div className="ml-4 grid flex-1 text-left">
          <span className="truncate leading-tight font-bold text-gray-900 text-xl">
            {text}
          </span>
        </div>
      )}
    </>
  );
}
