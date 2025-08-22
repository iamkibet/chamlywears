import React, { useState, createContext, useContext } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/common/CartDrawer';

interface MenuContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  openMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MainLayout');
  }
  return context;
}

interface MainLayoutProps {
  children: React.ReactNode;
  cartCount?: number;
}

export function MainLayout({ children, cartCount = 0 }: MainLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const contextValue: MenuContextType = {
    isMenuOpen,
    setIsMenuOpen,
    openMenu,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={cartCount} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </MenuContext.Provider>
  );
}
