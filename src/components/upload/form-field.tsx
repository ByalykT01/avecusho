import type { FormFieldPropsAdmin } from "~/lib/definitions";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const FormField: React.FC<FormFieldPropsAdmin> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
  not_required,
}) => (
  <div className="form-field">
    <Label htmlFor={name}>{placeholder}</Label>
    <Input
      type={type}
      placeholder={placeholder}
      {...register(name, { valueAsNumber: type === "number", required: !not_required })}
      id={name}
      className={error ? "input-error" : ""}
      step={type === "number" ? "0.01" : undefined}
    />
    {error && <span className="error-message">{error.message}</span>}
  </div>
);

export default FormField;
