"use client";

import { useCallback, useEffect, useState, memo } from "react";
import { CiMenuBurger, CiCircleRemove, CiShoppingCart } from "react-icons/ci";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import NavLinks from "./nav-links";
import Logo from "./icon";

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};

const useScrollDirection = (isDesktop: boolean) => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlHeader = useCallback(() => {
    if (!isDesktop) {
      setShowHeader(true);
      return;
    }

    const currentScrollY = window.scrollY;
    const scrollThreshold = 10;

    // More precise scroll direction detection
    if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
      // Scrolling down
      setShowHeader(false);
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up
      setShowHeader(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY, isDesktop]);

  useEffect(() => {
    if (!isDesktop) {
      setShowHeader(true);
      return;
    }

    const throttledControlHeader = throttle(controlHeader, 100);

    window.addEventListener("scroll", throttledControlHeader);

    return () => {
      window.removeEventListener("scroll", throttledControlHeader);
    };
  }, [controlHeader, isDesktop]);

  return showHeader;
};

// Throttle utility function
function throttle<F extends (...args: any[]) => any>(
  func: F,
  delay: number,
): (...args: Parameters<F>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return (...args: Parameters<F>) => {
    const currentTime = Date.now();

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (currentTime - lastExecTime >= delay) {
      lastExecTime = currentTime;
      func(...args);
    } else {
      timeoutId = setTimeout(() => {
        lastExecTime = Date.now();
        func(...args);
      }, delay);
    }
  };
}

const MobileMenuToggle = memo(
  ({
    isMenuOpen,
    toggleMenu,
  }: {
    isMenuOpen: boolean;
    toggleMenu: () => void;
  }) => (
    <div className="flex items-center md:hidden">
      <Link
        href="/cart"
        className="mr-4 py-2 transition-colors duration-200 hover:bg-gray-200/20"
        aria-label="Shopping Cart"
      >
        <CiShoppingCart className="text-2xl" />
      </Link>
      <button
        onClick={toggleMenu}
        className="rounded-full p-2 text-2xl transition-colors duration-200 hover:bg-gray-200/20"
        aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
      >
        {isMenuOpen ? <CiCircleRemove /> : <CiMenuBurger />}
      </button>
    </div>
  ),
);

MobileMenuToggle.displayName = "MobileMenuToggle";

// Main TopNav component with improved accessibility and performance
const TopNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const showHeader = useScrollDirection(isDesktop);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <header
      className={`sticky top-0 mb-8 flex h-16 items-center justify-between bg-topnav px-4 font-helvetica_thin text-white transition-all duration-300 ease-in-out sm:px-16 ${showHeader ? "translate-y-0" : "-translate-y-full"} z-50 shadow-md`}
      role="navigation"
    >
      <Logo />
      <NavLinks />

      <MobileMenuToggle isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default TopNav;
