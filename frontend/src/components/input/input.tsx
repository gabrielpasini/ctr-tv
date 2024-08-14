import { ReactElement } from "react";
import { Control, Controller, UseFormRegisterReturn } from "react-hook-form";
import InputMask from "react-input-mask";
import { CustomInput } from "./styles";

type InputProps = {
  type: string;
  inputMode?: "numeric" | "email";
  name: string;
  id: string;
  className: string;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  mask?: string;
  placeholder?: string;
  maxValue?: number;
  control?: Control;
  register?: UseFormRegisterReturn;
  onFieldChange?: (event: any) => any;
  fieldValue?: any;
  labelColor?: string;
};

export default function Input({
  type,
  inputMode,
  name,
  id,
  className,
  error,
  errorMessage,
  label,
  register,
  control,
  required,
  mask,
  placeholder,
  maxValue,
  onFieldChange,
  fieldValue,
  labelColor,
}: InputProps): ReactElement {
  const handleChange = (onChange: any, event: any) => {
    const value = event.target.value;
    if (inputMode === "numeric") {
      if (!Number.isNaN(Number(value))) {
        if (maxValue && Number(value) > maxValue) return;
        onChange(event);
      }
      return;
    }

    onChange(event);
  };

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
      {mask && control && register && (
        <Controller
          {...register}
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputMask
              mask={mask}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            >
              <CustomInput
                type={type}
                inputMode={inputMode}
                name={name}
                id={id}
                className={className}
                error={error}
                onChange={onFieldChange}
                value={fieldValue}
              />
            </InputMask>
          )}
        />
      )}
      {mask && !control && !register && (
        <InputMask
          mask={mask}
          placeholder={placeholder}
          value={fieldValue}
          onChange={onFieldChange}
        >
          <CustomInput
            type={type}
            inputMode={inputMode}
            name={name}
            id={id}
            className={className}
            error={error}
          />
        </InputMask>
      )}
      {!mask && control && register && (
        <Controller
          {...register}
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              type={type}
              inputMode={inputMode}
              placeholder={placeholder}
              name={name}
              id={id}
              className={className}
              error={error}
              onChange={(event) => handleChange(onChange, event)}
              value={value}
            />
          )}
        />
      )}
      {!mask && !control && !register && (
        <CustomInput
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          name={name}
          id={id}
          className={className}
          error={error}
          onChange={(event) => handleChange(onFieldChange, event)}
          value={fieldValue}
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
