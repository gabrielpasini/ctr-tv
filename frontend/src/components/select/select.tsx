import { ReactElement } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { CustomSelect } from "./styles";

type OptionType = {
  label: string;
  value: any;
};

type SelectProps = {
  name: string;
  id: string;
  className: string;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  options: OptionType[];
  register?: UseFormRegisterReturn;
  onFieldChange?: (event: any) => any;
  fieldValue?: any;
};

export default function Select({
  name,
  id,
  className,
  error,
  errorMessage,
  label,
  register,
  required,
  options,
  onFieldChange,
  fieldValue,
}: SelectProps): ReactElement {
  return (
    <>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required ? <span className="text-red-500"> *</span> : ""}
        </label>
      )}
      <CustomSelect
        {...register}
        id={id}
        name={name}
        className={className}
        error={error}
        onChange={onFieldChange}
        value={fieldValue}
      >
        {options.map((option: OptionType) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </CustomSelect>
      {errorMessage && (
        <pre>
          <p className="text-xs font-small text-red-500">{errorMessage}</p>
        </pre>
      )}
    </>
  );
}
