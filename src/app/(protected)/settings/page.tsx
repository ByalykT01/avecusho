"use client";

import { useCurrentUser } from "hooks/use-current-user";
import { lazy, Suspense } from "react";
import { LogoutButton } from "~/components/auth/logout-button";
import EditableUserDataCard from "~/components/settings/update-data";
import { Button } from "~/components/ui/button";

const UserData = lazy(() => import("~/components/settings/user-data"));

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex h-full w-full flex-col justify-center px-5 sm:px-5 md:px-5 lg:px-10">
        <div className="mx-auto">
            <UserData />
        </div>
        <div className="mx-auto h-1/5 justify-center">
          <LogoutButton>
            <Button>Log out</Button>
          </LogoutButton>
        </div>
      </div>
    </div>
  );
}
