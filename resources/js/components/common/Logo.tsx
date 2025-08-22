import React from 'react';
import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export function Logo({ showText = true, className = '' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <AppLogo showText={showText} />
    </Link>
  );
}
