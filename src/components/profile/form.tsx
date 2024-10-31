import { useForm } from "react-hook-form";
import type { AllAdditionalUserDataProps } from "~/lib/definitions";
import FormField from "./form-field";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserDataSchema } from "~/schemas";
import { UploadButton } from "~/utils/uploadthing";
import { useEffect, useState } from "react";
import { useCurrentUser } from "hooks/use-current-user";

interface FormProps {
  onSubmit: (data: AllAdditionalUserDataProps) => void;
  defaultValues?: AllAdditionalUserDataProps;
}

function Form({ onSubmit, defaultValues }: FormProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultValues?.image ?? "");
  const user = useCurrentUser();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AllAdditionalUserDataProps>({
    resolver: zodResolver(UserDataSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      setImageUrl(defaultValues.image ?? imageUrl);
    }
  }, [defaultValues, reset, imageUrl]);

  const handleFormSubmit = async (data: AllAdditionalUserDataProps) => {
    try {
      const userId = user?.id;
      const requestData = { ...data, userId };
      const response = await fetch("/api/user/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const responseData = await response.json();
      if (responseData.success) {
        toast.success("Form submitted successfully!");
        onSubmit(data);
      } else {
        toast.error("Submission error");
      }
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto w-full max-w-4xl"
    >
      <div className="space-y-8 rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">User Information</h1>
          <p className="text-gray-500">
            Please fill in your personal details below.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Profile Image
            </h2>
            <div className="flex flex-col gap-4">
              {imageUrl && (
                <div className="h-32 w-32 overflow-hidden rounded-full">
                  <img
                    src={imageUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <UploadButton
                  className="rounded px-4 py-2 font-bold text-white"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    toast.success("Files uploaded");
                    const uploadedUrl = res[0]?.url ?? "";
                    setImageUrl(uploadedUrl);
                    setValue("image", uploadedUrl);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`ERROR! ${error.message}`);
                  }}
                />
                <p className="mt-2 text-gray-500">
                  Upload an optional profile image.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Personal Details
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                type="email"
                placeholder="Email"
                name="email"
                register={register}
                error={errors.email}
              />
              <FormField
                type="text"
                placeholder="Your name"
                name="name"
                register={register}
                error={errors.name}
              />
              <FormField
                type="text"
                placeholder="Phone number"
                name="phoneNumber"
                register={register}
                error={errors.phoneNumber}
              />
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Address Details
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                type="text"
                placeholder="Country"
                name="country"
                register={register}
                error={errors.country}
              />
              <FormField
                type="text"
                placeholder="State"
                name="state"
                register={register}
                error={errors.state}
              />
              <FormField
                type="text"
                placeholder="City"
                name="city"
                register={register}
                error={errors.city}
              />
              <FormField
                type="text"
                placeholder="Postcode"
                name="postcode"
                register={register}
                error={errors.postcode}
              />
              <FormField
                type="text"
                placeholder="Street"
                name="street"
                register={register}
                error={errors.street}
              />
              <FormField
                type="text"
                placeholder="House number"
                name="houseNumber"
                register={register}
                error={errors.houseNumber}
              />
              <FormField
                type="text"
                placeholder="Apartment number"
                name="apartmentNumber"
                register={register}
                error={errors.apartmentNumber}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Information
        </button>
      </div>
    </form>
  );
}

export default Form;
