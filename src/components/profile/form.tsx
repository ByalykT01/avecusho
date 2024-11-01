import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UploadButton } from '~/utils/uploadthing';
import { useCurrentUser } from 'hooks/use-current-user';
import { UserDataSchema } from '~/schemas';
import type { AllAdditionalUserDataProps } from '~/lib/definitions';
import FormField from './form-field';


// Types for form fields
type FormFieldConfig = {
  name: keyof AllAdditionalUserDataProps;
  type: string;
  placeholder: string;
};

type FormSection = {
  title: string;
  fields: FormFieldConfig[];
};

// Constants
const FORM_SECTIONS: Record<'PERSONAL' | 'ADDRESS', FormSection> = {
  PERSONAL: {
    title: 'Personal Details',
    fields: [
      { name: 'email', type: 'email', placeholder: 'Email' },
      { name: 'name', type: 'text', placeholder: 'Your name' },
      { name: 'phoneNumber', type: 'text', placeholder: 'Phone number' },
    ],
  },
  ADDRESS: {
    title: 'Address Details',
    fields: [
      { name: 'country', type: 'text', placeholder: 'Country' },
      { name: 'state', type: 'text', placeholder: 'State' },
      { name: 'city', type: 'text', placeholder: 'City' },
      { name: 'postcode', type: 'text', placeholder: 'Postcode' },
      { name: 'street', type: 'text', placeholder: 'Street' },
      { name: 'houseNumber', type: 'text', placeholder: 'House number' },
      { name: 'apartmentNumber', type: 'text', placeholder: 'Apartment number' },
    ],
  },
};

interface FormProps {
  onSubmit: (data: AllAdditionalUserDataProps) => void;
  defaultValues?: AllAdditionalUserDataProps;
}

const UserForm = ({ onSubmit, defaultValues }: FormProps) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultValues?.image ?? '');
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
      setImageUrl(defaultValues.image ?? '');
    }
  }, [defaultValues, reset]);

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setValue('image', url);
    toast.success('Profile image uploaded successfully');
  };

  const handleFormSubmit = async (data: AllAdditionalUserDataProps) => {
    try {
      const requestData = {
        ...data,
        userId: user?.id,
        image: imageUrl,
      };

      const response = await fetch('/api/user/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json() as { success: boolean };

      if (result.success) {
        toast.success('Profile updated successfully!');
        onSubmit(data);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const renderFormSection = ({ title, fields }: FormSection) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <FormField
              key={field.name}
              type={field.type}
              placeholder={field.placeholder}
              name={field.name}
              register={register}
              error={errors[field.name]}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto w-full max-w-4xl"
    >
      <div className="space-y-8 rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">User Information</h1>
          <p className="text-gray-500">Please fill in your personal details below.</p>
        </div>

        {/* Profile Image Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Profile Image</h2>
            <div className="flex flex-col gap-4">
              {imageUrl && (
                <div className="h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src={imageUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                    width={300}
                    height={300}
                    priority
                  />
                </div>
              )}
              <div>
                <UploadButton
                  className="rounded px-4 py-2 font-bold text-white"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const uploadedUrl = res?.[0]?.url;
                    if (uploadedUrl) handleImageUpload(uploadedUrl);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                />
                <p className="mt-2 text-gray-500">
                  Upload an optional profile image.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        {renderFormSection(FORM_SECTIONS.PERSONAL)}
        {renderFormSection(FORM_SECTIONS.ADDRESS)}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white 
                   shadow-sm transition-colors duration-200 hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Information
        </button>
      </div>
    </form>
  );
};

export default UserForm;