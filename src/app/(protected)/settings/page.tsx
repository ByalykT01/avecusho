"use client";

import { useCurrentUser } from "hooks/use-current-user";
import { Suspense } from "react";
import EditableUserDataCard from "~/components/settings/update-data";
import UserData from "~/components/settings/user-data";
import type { UserDataProps } from "~/lib/definitions";

export default function SettingsPage() {
  const user = useCurrentUser() as UserDataProps;
  console.log(user);
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex h-full w-full flex-row px-5 sm:px-5 md:px-5 lg:px-10">
        <div className="h-full w-1/3">
          <Suspense fallback={<p>Loading feed...</p>}>
            <UserData user={user} />
          </Suspense>
        </div>
        <div className="flex w-2/3 flex-col">
            <EditableUserDataCard user={user} />
        </div>
      </div>
    </div>
  );
}
