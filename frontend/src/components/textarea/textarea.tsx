import { ReactElement } from "react";
import { Control, Controller, UseFormRegisterReturn } from "react-hook-form";
import { CustomTextarea } from "./styles";

type InputProps = {
  name: string;
  id: string;
  className: string;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  control?: Control;
  register?: UseFormRegisterReturn;
  onFieldChange?: (event: any) => any;
  fieldValue?: any;
  labelColor?: string;
  rows?: number;
  maxLength?: number;
};

export default function Textarea({
  name,
  id,
  className,
  error,
  errorMessage,
  label,
  register,
  control,
  required,
  placeholder,
  onFieldChange,
  fieldValue,
  labelColor,
  rows,
  maxLength,
}: InputProps): ReactElement {
  const classNameNoRing = `${className} focus:outline-none focus:ring-0`;

  return (
    <>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-${
            labelColor ? labelColor : "gray-700"
          }`}
        >
          {label}
          {required ? <span className="text-red-500"> *</span> : ""}
        </label>
      )}
      {control && register && (
        <Controller
          {...register}
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomTextarea
              placeholder={placeholder}
              name={name}
              id={id}
              className={classNameNoRing}
              error={error}
              onChange={(event) => onChange(event)}
              value={value}
              rows={rows}
              maxLength={maxLength}
            />
          )}
        />
      )}
      {!control && !register && (
        <CustomTextarea
          placeholder={placeholder}
          name={name}
          id={id}
          className={classNameNoRing}
          error={error}
          onChange={(event) => onFieldChange?.(event)}
          value={fieldValue}
          rows={rows}
          maxLength={maxLength}
        />
      )}
      {errorMessage && (
        <pre>
          <p className="text-xs font-small text-red-500">{errorMessage}</p>
        </pre>
      )}
    </>
  );
}
