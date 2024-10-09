'use client'

import type { UserDataProps } from "~/lib/definitions"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function UserData({ user }: { user: UserDataProps }) {
  return (
    <Card className="w-full max-w-3xl pl-10 mx-auto border-0 shadow-none ">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Image
            src={user.image}
            width={100}
            height={100}
            alt={`${user.name}'s profile picture`}
            className="rounded-full border-2 border-gray-200"
          />
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">{user.name}</CardTitle>
            <p className="text-lg text-gray-600">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 pt-3">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Shipping Address</h2>
          <p className="text-gray-600">
            1234 Elm Street, Apt 56 <br />
            Cityville, CA 12345
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Phone Number</h2>
          <p className="text-gray-600">+1 (555) 123-4567</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Other additional stuff</h2>
          <p className="text-gray-600">Soon</p>
        </section>
      </CardContent>
    </Card>
  )
}