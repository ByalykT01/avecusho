"use client";
import { useCallback, useEffect, useState } from "react";
import { CiMenuBurger, CiCircleRemove } from "react-icons/ci";
import MobileMenu from "./mobile-menu";
import NavLinks from "./nav-links";
import Logo from "./icon";

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
      className={`bg-topnav mb-8 font-helvetica_thin sticky top-0 flex h-16 items-center justify-between px-4 text-white transition-transform duration-200 sm:px-16 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
    >
      <Logo />
      <NavLinks />
      <div className="flex flex-1 items-center justify-between md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-auto text-2xl"
        >
          {isMenuOpen ? <CiCircleRemove /> : <CiMenuBurger />}
        </button>
      </div>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default TopNav;
