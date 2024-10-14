"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";  // Import useRouter
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import type { UserDataProps } from "~/lib/definitions";
import { Camera, Loader2 } from "lucide-react";
import { LogoutButton } from "../auth/logout-button";
import { FaUser } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default function EditableUserDataCard({
  user,
}: {
  user: UserDataProps;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(user);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const updatedData = (await response.json()) as UserDataProps;
      setUserData(updatedData);
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="mb-4 text-center text-2xl font-bold">
            Edit Your Profile
          </CardTitle>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {userData.image ? (
                <Image
                  src={userData.image}
                  width={100}
                  height={100}
                  alt={`${userData.name}'s profile picture`}
                  className="rounded-full border-2 border-gray-200"
                />
              ) : (
                <FaUser />
              )}
              <Button
                type="button"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change profile picture</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={userData.name}
              onChange={(event) => handleInputChange(event)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={(event) => handleInputChange(event)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between space-x-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <LogoutButton>
            <Button className="flex-1">Log out</Button>
          </LogoutButton>
        </CardFooter>
      </form>
    </Card>
  );
}
