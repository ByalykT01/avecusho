"use client";

import Image from "next/image";
import logo from "../../../public/avecusho.svg";
import searchIcon from "../../../public/ui_elements/search.svg";
import cartIcon from "../../../public/ui_elements/cart.svg";
import { useCallback, useEffect, useState } from "react";

type NavItem = {
  label: string;
  href?: string;
};
export function TopNav() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems: NavItem[] = [
    { label: "About Me", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Shop" },
  ];

  const controlHeader = useCallback(() => {
    if (window.scrollY > lastScrollY) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", controlHeader);
    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [controlHeader]);

  return (
    <header
      className={`sticky top-0 mb-8 border-b border-gray-500 bg-zinc-100 transition-transform duration-200 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
    >
      <nav>
        <div className="mx-auto flex max-w-screen-xl justify-between px-4 py-3 sm:px-8 md:px-12 lg:px-32">
          <div className="w-50 flex justify-between">
            <Image src={logo} height={50} width={50} alt="logo" />
            {navItems.map((item) => (
              <div
                key={item.label}
                className="my-auto px-1 sm:px-3 md:px-4 lg:px-5"
              >
                <a
                  href={item.href ?? "/"}
                  className="duration-300 hover:font-semibold hover:underline"
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>
          <div className="w-50 flex">
            <div className="mx-2 my-auto">
              <Image src={searchIcon} height={25} width={25} alt="search" />
            </div>
            <div className="mx-2 my-auto">
              <Image src={cartIcon} height={25} width={25} alt="search" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
