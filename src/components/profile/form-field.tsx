import React from 'react';
import type { FormFieldPropsUser } from "~/lib/definitions";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const FormField: React.FC<FormFieldPropsUser> = ({
  type,
  placeholder,
  name,
  register,
  error,
}) => (
  <div className="flex flex-col space-y-1.5">
    <Label 
      htmlFor={name}
      className="text-sm font-medium text-gray-700"
    >
      {placeholder}
    </Label>
    <Input
      type={type}
      placeholder={placeholder}
      {...register(name)}
      id={name}
      className={`h-10 px-3 py-2 text-sm rounded-md border transition-colors
        ${error 
          ? 'border-red-300 bg-red-50 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
          : 'border-gray-200 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
        }
        focus:outline-none focus:ring-2 focus:ring-offset-0`}
    />
    {error && (
      <span className="text-sm text-red-500 mt-1">
        {error.message}
      </span>
    )}
  </div>
);

export default FormField;