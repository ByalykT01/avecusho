import { type FieldError, type UseFormRegister } from "react-hook-form";

export type Item = {
  id: number;
  name: string;
  url: string;
  price: string;
  description: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export interface CartItemData {
  id: number;
  cartId: number;
  itemId: number;
  addedAt: Date;
}

export interface UserDataProps {
  name: string;
  email: string;
  image: string;
  id: string;
  emailVerified: Date;
  role: "USER" | "ADMIN";
}

export interface AdditionalUserDataProps {
  apartmentNumber?: string | undefined;
  phoneNumber: string;
  country?: string | undefined;
  state?: string | undefined;
  city?: string | undefined;
  postcode?: string | undefined;
  street?: string | undefined;
  houseNumber?: string | undefined;
}

export interface AllAdditionalUserDataProps extends AdditionalUserDataProps {
  name: string;
  email: string;
  image?: string | undefined;
}

export interface UploadProps {
  name: string;
  price: number;
  description: string;
}

export interface NewItemProps extends UploadProps {
  url: string;
}

export type FormFieldProps = {
  type: string;
  placeholder: string;
  error: FieldError | undefined;
  not_required?: boolean;
};

export type FormFieldPropsAdmin = FormFieldProps & {
  valueAsNumber?: boolean;
  register: UseFormRegister<UploadProps>;
  name: ValidFieldNamesAdmin;
};

export type FormFieldPropsUser = FormFieldProps & {
  register: UseFormRegister<AllAdditionalUserDataProps>;
  name: ValidFieldNamesUser;
};

export type ValidFieldNamesAdmin = "name" | "price" | "description";
export type ValidFieldNamesUser =
  | "name"
  | "email"
  | "image"
  | "phoneNumber"
  | "country"
  | "state"
  | "city"
  | "postcode"
  | "street"
  | "houseNumber"
  | "apartmentNumber";
