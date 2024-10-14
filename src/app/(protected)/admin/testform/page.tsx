"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Form from "~/components/upload/form";
import type { UploadProps } from "~/lib/definitions";

export default function AdminPageTest() {
  const [formData, setFormData] = useState<UploadProps | null>(null);
  const handleFormSubmit = (data: UploadProps) => {
    setFormData(data); // Save form data to state
  };

  const onClick = async () => {
    const imageUrl = "idkbro";
    if (!formData || !imageUrl) {
      console.error("Please fill out the form and upload an image.");
      return;
    }

    const combinedData = { ...formData, imageUrl }; // Combine form data with image URL
  };
  return (
    <div>
      <Form onSubmit={handleFormSubmit} />
      {formData ? (
        <div>
          <Button onClick={onClick}>Final submit</Button>
        </div>
      ) : (
        <> </>
      )}
    </div>
  );
}
