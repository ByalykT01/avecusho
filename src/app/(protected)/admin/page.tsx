// pages/admin.tsx
"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { RoleGate } from "~/components/auth/role-gate";
import { FormSuccess } from "~/components/form-success";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import Form from "~/components/upload/form";
import type { UploadProps } from "~/lib/definitions";
import { UploadButton } from "~/utils/uploadthing";

export default function AdminPage() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [formData, setFormData] = useState<UploadProps | null>(null); // Initialize to null

  const handleFormSubmit = useCallback((data: UploadProps) => {
    setFormData(data);
  }, []);

  const onClick = useCallback(async () => {
    if (!formData || !imageUrl) {
      toast.error("Please fill out the form and upload an image.");
      return;
    }

    const combinedData = { ...formData, url: imageUrl }; // Combine form data with image URL

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(combinedData),
      });

      if (response.ok) {
        toast.success("Item created successfully!");
        setFormData(null); 
        setImageUrl("");
      } else {
        toast.error("Operation failed. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please check your connection.");
    }
  }, [formData, imageUrl]);

  return (
    <div className="flex w-full flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Admin Page
          </h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <RoleGate allowedRole="ADMIN">
            <FormSuccess message="You are logged in as an admin." />
            <Form onSubmit={handleFormSubmit} />

            <UploadButton
              className="rounded px-4 py-2 font-bold text-white"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                toast.success("Files uploaded");
                setImageUrl(res[0].url);
              }}
              onUploadError={(error: Error) => {
                toast.error(`ERROR! ${error.message}`);
              }}
            />
            {imageUrl && (
              <div>
                <h2>Image Preview</h2>
                <Image
                  src={imageUrl}
                  alt="Uploaded Image"
                  width={500}
                  height={300}
                />
              </div>
            )}

            {formData && (
              <Button onClick={onClick} className="mt-4 w-full">
                Submit All
              </Button>
            )}
          </RoleGate>
        </CardContent>
      </Card>
    </div>
  );
}
