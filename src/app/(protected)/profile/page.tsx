"use client";

import { lazy } from "react";

const UserData = lazy(() => import("~/components/profile/user-data"));

export const dynamic = "force-dynamic";

export default function AccountPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-5">My Account</h1>
        <UserData />
    </div>
  );
}
