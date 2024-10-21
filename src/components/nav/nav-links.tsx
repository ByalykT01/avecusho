// NavLinks.tsx
import Link from "next/link";
import React from "react";
import { CiShoppingCart } from "react-icons/ci";
import { LoginButton } from "../auth/login-button";
import { UserButton } from "../auth/user-button";

export default function NavLinks() {
  return (
    <div className="ml-32 hidden flex-1 items-center justify-between md:ml-8 md:flex lg:ml-32">
      <div className="flex space-x-20 md:space-x-10 lg:space-x-20">
        <Link href={"/contact"} className="hover:font-semibold hover:underline">
          <div className="text-center text-3xl">Contact</div>
        </Link>
        <Link href={"/about"} className="hover:font-semibold hover:underline">
          <div className="text-center text-3xl">About Me</div>
        </Link>
        <Link href={"/"} className="hover:font-semibold hover:underline">
          <div className="text-center text-3xl">Store</div>
        </Link>
      </div>

      <div className="hidden space-x-10 md:flex">
        <Link href={"/cart"}>
          <div className="text-center text-3xl">
            <CiShoppingCart />
          </div>
        </Link>
        <LoginButton>
          <UserButton />
        </LoginButton>
      </div>
    </div>
  );
}
