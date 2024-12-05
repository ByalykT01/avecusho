"use client";

import { useCallback, useEffect, useState, memo } from "react";
import { CiMenuBurger, CiCircleRemove, CiShoppingCart } from "react-icons/ci";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

    if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
      setShowHeader(false);
    } else if (currentScrollY < lastScrollY) {
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

const TopNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const showHeader = useScrollDirection(isDesktop);
  const router = useRouter();

  // Secret gesture states
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleLogoInteraction = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const currentTime = Date.now();
    
    if (currentTime - lastTapTime > 2000) {
      setTapCount(1);
    } else {
      setTapCount(prev => prev + 1);
    }
    
    setLastTapTime(currentTime);

    if (tapCount === 2) {
      setIsRotating(true);
      setRotationAngle(0);
      
      window.addEventListener('deviceorientation', handleOrientation);
      
      setTimeout(() => {
        setIsRotating(false);
        setTapCount(0);
        window.removeEventListener('deviceorientation', handleOrientation);
      }, 5000);
    }
  }, [tapCount, lastTapTime]);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (event.gamma && Math.abs(event.gamma) > 60) {
      router.push('/special');
      setIsRotating(false);
      setTapCount(0);
      window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [router]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <header
      className={`sticky top-0 mb-8 flex h-16 items-center justify-between bg-topnav px-4 font-helvetica_thin text-white transition-all duration-300 ease-in-out sm:px-16 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      } z-50 shadow-md`}
      role="navigation"
    >
      <div 
        onClick={handleLogoInteraction}
        className={`cursor-pointer transition-all duration-300 ${isRotating ? 'animate-spin' : ''}`}
      >
        <Logo />
      </div>
      <NavLinks />
      <MobileMenuToggle isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default TopNav;