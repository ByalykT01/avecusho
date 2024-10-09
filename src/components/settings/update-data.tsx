"use client";

import { useState } from "react";
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
import type{ UserDataProps } from "~/lib/definitions";
import { Camera, Loader2 } from "lucide-react";
import { LogoutButton } from "../auth/logout-button";

export default function EditableUserDataCard({
  user,
}: {
  user: UserDataProps;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(user);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log("Updated user data:", userData);
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
              <Image
                src={userData.image}
                width={100}
                height={100}
                alt={`${userData.name}'s profile picture`}
                className="rounded-full border-2 border-gray-200"
              />
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Shipping Address</Label>
            <Textarea
              id="address"
              name="address"
              value={""}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={""}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between space-x-4 ">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin " />
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
