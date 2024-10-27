"use client";
import { useCallback, useEffect, useState } from "react";
import { CiMenuBurger, CiCircleRemove, CiShoppingCart } from "react-icons/ci";
import MobileMenu from "./mobile-menu";
import NavLinks from "./nav-links";
import Logo from "./icon";
import Link from "next/link";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    setMatches(mediaQuery.matches);

    const updateMatches = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', updateMatches);
    
    return () => {
      mediaQuery.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
};

const useScrollDirection = (isDesktop: boolean) => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlHeader = useCallback(() => {
    if (!isDesktop) {
      return;
    }

    const currentScrollY = window.scrollY;
    const isScrollingUp = currentScrollY <= lastScrollY;

    setShowHeader(isScrollingUp);
    setLastScrollY(currentScrollY);
  }, [lastScrollY, isDesktop]);

  useEffect(() => {
    if (!isDesktop) {
      setShowHeader(true);
      return;
    }

    window.addEventListener('scroll', controlHeader);
    
    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, [controlHeader, isDesktop]);

  return showHeader;
};

const TopNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const showHeader = useScrollDirection(isDesktop);

  return (
    <div
      className={`bg-topnav mb-8 font-helvetica_thin sticky top-0 flex h-16 items-center justify-between px-4 text-white transition-transform duration-200 sm:px-16 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      } z-50`}
    >
      <Logo />
      <NavLinks />
      
      {/* Mobile view controls */}
      <div className="flex items-center md:hidden">
        <Link href="/cart">
          <div className="mr-4 py-2 hover:bg-gray-200">
            <CiShoppingCart className="text-2xl" />
          </div>
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl"
        >
          {isMenuOpen ? <CiCircleRemove /> : <CiMenuBurger />}
        </button>
      </div>
      
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default TopNav;