"use client";

export const dynamic = "force-dynamic";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useCurrentUser } from "hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { LoginButton } from "./login-button";
import type { UserDataProps } from "~/lib/definitions";
import Image from "next/image";
import Link from "next/link";

export function UserButton() {
  const user = useCurrentUser() as UserDataProps;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex cursor-pointer items-center space-x-2">
          {user ? (
            user.image ? (
              <Image
                src={user.image}
                width={35}
                height={35}
                alt="User Avatar"
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <p className="text-2xl hover:font-semibold hover:underline">User Page</p>
            )
          ) : (
            <p className="text-2xl hover:font-semibold hover:underline">Log In</p>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {user ? (
          <>
            <Link href={"/profile"}>
              <DropdownMenuItem className="text-left">Account</DropdownMenuItem>
            </Link>
            <LogoutButton>
              <DropdownMenuItem className="text-left">Logout</DropdownMenuItem>
            </LogoutButton>
          </>
        ) : (
          <LoginButton>
            <DropdownMenuItem className="text-left">Log in</DropdownMenuItem>
          </LoginButton>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
