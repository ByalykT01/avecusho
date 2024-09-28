"use client";

import { useCurrentUser } from "hooks/use-current-user";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const user = useCurrentUser();
  console.log(user);
  const onClick = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-10 flex flex-col bg-zinc-100 p-10">
        <p>{user?.name}</p>
        <p>{user?.email} </p>
        <p>{user?.id} </p>
        <p>{user?.role} </p>
      </div>
      <div className="bg-zinc-100 p-10">
        <button onClick={onClick} type="submit">
          Sign Out
        </button>
      </div>
    </div>
  );
}
