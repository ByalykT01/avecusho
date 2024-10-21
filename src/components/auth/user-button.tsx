"use client";

export const dynamic = "force-dynamic";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { LoginButton } from "./login-button";
import type { UserDataProps } from "~/lib/definitions";

export function UserButton() {
  const user = useCurrentUser() as UserDataProps;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image ?? ""} />
          <AvatarFallback>
            {user ? Array.from(user.name)[0]?.toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <>
            <DropdownMenuItem>Account</DropdownMenuItem>
            <LogoutButton>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </LogoutButton>
          </>
        ) : (
          <LoginButton>
            <DropdownMenuItem>Login</DropdownMenuItem>
          </LoginButton>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
