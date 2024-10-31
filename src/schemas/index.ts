import * as z from "zod";
import validator from "validator";
//Auth chemas

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required!",
  }),
  password: z.string().min(1, {
    message: "Password is required!",
  }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required!",
  }),
  email: z.string().email({
    message: "Email is required!",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required!",
  }),
});

//Admin panel schemas

export const UploadItemSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  price: z
    .number()
    .positive({
      message: "Price should be positive",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "Price can have up to two decimal places",
    }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  url: z.string().url().includes("utfs.io", { message: "Invalid photo URL" }),
});

export const FormItemSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  price: z
    .number()
    .positive({
      message: "Price should be positive",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "Price can have up to two decimal places",
    }),
  description: z.string().optional(),
});

//Edit user info schemas

export const UserDataSchema = z.object({
  // Required fields with enhanced validation
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name is too long" })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Name can only contain letters, spaces, hyphens and apostrophes",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("This is not a valid email")
    .max(255, { message: "Email is too long" })
    .toLowerCase(),

  image: z
    .string()
    .url({ message: "Must be a valid URL" })
    .refine(
      (url) => url.includes("utfs.io") || url.includes("lh3.googleusercontent"),
      { message: "Invalid photo URL" },
    )
    .optional(),

  phoneNumber: z
    .string()
    .refine((phone) => phone.length >= 10 && phone.length <= 15, {
      message: "Phone number must be between 10 and 15 digits",
    }),

  // Optional fields with validation when provided
  country: z
    .string()
    .min(2, { message: "Country name is too short" })
    .max(56, { message: "Country name is too long" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Invalid country name format" })
    .optional(),

  state: z
    .string()

    .regex(/^[a-zA-Z\s'-]+$/, { message: "Invalid state name format" })
    .optional(),

  city: z
    .string()
    .min(2, { message: "City name is too short" })
    .max(85, { message: "City name is too long" })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Invalid city name format" })
    .optional(),

  postcode: z
    .string()
    .regex(/^[0-9A-Z\s-]{3,10}$/i, {
      message: "Invalid postal code format",
    })
    .optional(),

  street: z
    .string()
    .min(2, { message: "Street name is too short" })
    .max(100, { message: "Street name is too long" })
    .regex(/^[a-zA-Z0-9\s'-]+$/, { message: "Invalid street name format" })
    .optional(),

  houseNumber: z
    .string()
    .regex(/^[0-9A-Z-/]{1,10}$/i, {
      message: "Invalid apartment number format",
    })
    .optional(),

  apartmentNumber: z
    .string()
    .regex(/^[0-9A-Z-]{1,10}$/i, {
      message: "Invalid apartment number format",
    })
    .optional(),
});

export const ExtendedUserDataSchema = UserDataSchema.extend({
  userId: z.string()
});