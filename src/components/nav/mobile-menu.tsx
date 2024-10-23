import React from "react";
import Link from "next/link";
import { LoginButton } from "../auth/login-button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) =>
  isOpen && (
    <div className="absolute right-0 top-16 flex w-full flex-col bg-white text-center text-black shadow-lg">
      <Link href="/store" onClick={onClose}>
        <div className="border-b py-2 hover:bg-gray-200">Store</div>
      </Link>
      <Link href="/contact" onClick={onClose}>
        <div className="border-b py-2 hover:bg-gray-200">Contact</div>
      </Link>
      <Link href="/" onClick={onClose}>
        <div className="border-b py-2 hover:bg-gray-200">About Me</div>
      </Link>
      <Link href="/cart" onClick={onClose}>
        <div className="border-b py-2 hover:bg-gray-200">Cart</div>
      </Link>
      <LoginButton>
        <div onClick={onClose} className="border-b py-2 hover:bg-gray-200">User Page</div>
      </LoginButton>
    </div>
  );

export default MobileMenu;
