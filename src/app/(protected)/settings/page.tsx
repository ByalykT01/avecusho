"use client";

import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
  const session = useSession();

  const onClick = async () => {
    await signOut();
  };
  return (
    <div>
      {JSON.stringify(session)}
      <button onClick={onClick} type="submit">
        Sign Out
      </button>
    </div>
  );
}
