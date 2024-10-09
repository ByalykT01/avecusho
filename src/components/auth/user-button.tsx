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
        <Avatar className="mt-2">
          <AvatarImage src={user?.image ?? ""} />
          <AvatarFallback>
            <FaUser className="h-5 w-5 mb-2" />
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
