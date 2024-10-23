"use client";

import { lazy } from "react";

const UserData = lazy(() => import("~/components/settings/user-data"));

export const dynamic = "force-dynamic";

export default function AccountPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="mt-10 text-4xl font-bold text-gray-800">My Account</h1>
        <UserData />
    </div>
  );
}
