"use client";

import type { UserDataProps } from "~/lib/definitions";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FaUser } from "react-icons/fa";

import { useCurrentUser } from "hooks/use-current-user";
import { useEffect } from "react";

export const dynamic = "force-dynamic";

export default function UserData() {
  const user = useCurrentUser() as UserDataProps;

  useEffect(() => {
    if (!user) {
      window.location.reload();
    }
  }, [user]);

  return (
    <>
      {user ? (
        <Card className="mx-auto w-full max-w-3xl border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center space-x-4">
              {user.image ? (
                <Image
                  src={user?.image}
                  width={100}
                  height={100}
                  alt={`${user.name}'s profile picture`}
                  className="rounded-full border-2 border-gray-200"
                />
              ) : (
                <FaUser className="text-5xl text-gray-500" />
              )}
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {user.name}
                </CardTitle>
                <p className="text-lg text-gray-600">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 pt-3">
            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Shipping Address
              </h2>
              <p className="text-gray-600">
                1234 Elm Street, Apt 56 <br />
                Cityville, CA 12345
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Phone Number
              </h2>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </section>
            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Other additional stuff
              </h2>
              <p className="text-gray-600">Soon</p>
            </section>
          </CardContent>
        </Card>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
