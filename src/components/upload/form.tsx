import { useForm } from "react-hook-form";
import FormField from "./form-field";
import { Button } from "../ui/button";
import type { UploadProps } from "~/lib/definitions";
import { FormItemSchema } from "~/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface FormProps {
  onSubmit: (data: UploadProps) => void;
}

function Form({ onSubmit }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadProps>({
    resolver: zodResolver(FormItemSchema),
  });

  const handleFormSubmit = async (data: UploadProps) => {
    toast.success(`Data for ${data.name} is saved`);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <h1 className="mb-4 text-3xl font-bold">New Item Form</h1>

        <FormField
          type="text"
          placeholder="Item name"
          name="name"
          register={register}
          error={errors.name}
        />

        <FormField
          type="number"
          placeholder="Price"
          name="price"
          register={register}
          error={errors.price}
          valueAsNumber
        />

        <FormField
          type="text"
          placeholder="Item description (optional)"
          name="description"
          register={register}
          error={errors.description}
          not_required={true} // Pass not_required prop here
        />

        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </div>
    </form>
  );
}

export default Form;
