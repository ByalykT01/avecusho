"use client";
import Form from "~/components/profile/form";
import { useEffect, useState } from "react";
import type {
  AllAdditionalUserDataProps,
  UserDataProps,
} from "~/lib/definitions";
import { useCurrentUser } from "hooks/use-current-user";
import { redirect } from "next/navigation";

export default function EditPage() {
  const [formData, setFormData] = useState<AllAdditionalUserDataProps | null>(null);
  const [defaultValues, setDefaultValues] = useState<AllAdditionalUserDataProps | null>(null);
  const user = useCurrentUser() as UserDataProps;

  const handleFormSubmit = (data: AllAdditionalUserDataProps) => {
    setFormData(data);
    console.log("Submitted data:", data);
  };

  const getUserInfo = async (userId: string) => {
    try {
      const response = await fetch("/api/user/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = (await response.json()) as AllAdditionalUserDataProps;
      console.log("FOUND DATA", data)
      return data;
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!user) {
      redirect("/auth/login");
    } else {
      // Fetch user info when component mounts
      const fetchUserInfo = async () => {
        const userInfo = await getUserInfo(user.id);
        if (userInfo) {
          setDefaultValues(userInfo);
        }
      };
      void fetchUserInfo();
    }
  }, [user]);

  if (!defaultValues) {
    return <div>Loading...</div>;
  }

  return (
    <Form onSubmit={handleFormSubmit} defaultValues={defaultValues} />
  );
}