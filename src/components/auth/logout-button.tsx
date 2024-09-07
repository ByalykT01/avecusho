"use client";

import { signOut } from "next-auth/react";
import { logout } from "~/actions/logout";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export function LogoutButton({ children }: LogoutButtonProps) {
  const onClick = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}
