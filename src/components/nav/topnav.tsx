"use client";
import { useCallback, useEffect, useState } from "react";
import { CiMenuBurger, CiCircleRemove, CiShoppingCart } from "react-icons/ci";
import MobileMenu from "./mobile-menu";
import NavLinks from "./nav-links";
import Logo from "./icon";
import Link from "next/link";

const TopNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlHeader = useCallback(() => {
    setShowHeader(window.scrollY <= lastScrollY);
    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        window.addEventListener("scroll", controlHeader);
      } else {
        setShowHeader(true);
        window.removeEventListener("scroll", controlHeader);
      }
    };

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
      window.removeEventListener("scroll", controlHeader);
    };
  }, [controlHeader]);

  return (
    <div
      className={`bg-topnav mb-8 font-helvetica_thin sticky top-0 flex h-16 items-center justify-between px-4 text-white transition-transform duration-200 sm:px-16 ${showHeader ? "translate-y-0" : "-translate-y-full"} z-50`}
    >
      <Logo />
      <NavLinks />
      {/* Mobile view controls */}
      <div className="flex items-center md:hidden">
        {/* Move Cart and Menu to the right */}
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
