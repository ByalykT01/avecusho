import * as z from "zod";

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
  description: z.string().min(1, {
    message: "Description is required",
  }),
});
