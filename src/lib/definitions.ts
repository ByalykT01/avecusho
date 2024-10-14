import {type FieldError, type UseFormRegister } from "react-hook-form";

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

export interface CartItem {
  id: number;
  cartId: number;
  itemId: number;
  addedAt: Date;
}

export interface UserDataProps {
  name: string,
  email: string,
  image: string,
  id: string,
  role: 'USER'|'ADMIN'
}

export interface UploadProps { 
  name: string,
  price: number,
  description: string,
}

export interface NewItemProps extends UploadProps {
  url: string
}

export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<UploadProps>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};


export type ValidFieldNames =
| "name"
| "price"
| "description"