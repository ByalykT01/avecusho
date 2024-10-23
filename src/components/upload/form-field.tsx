import type { FormFieldProps } from "~/lib/definitions";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const FormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
}) => (
  <div className="form-field">
    <Label htmlFor={name}>{placeholder}</Label>
    <Input
      type={type}
      placeholder={placeholder}
      {...register(name, { 
        valueAsNumber: type === "number", 
      })}
      id={name}
      className={error ? "input-error" : ""}
      step={type === "number" ? "0.01" : undefined} // Add step for number type
    />
    {error && <span className="error-message">{error.message}</span>}
  </div>
);

export default FormField;
