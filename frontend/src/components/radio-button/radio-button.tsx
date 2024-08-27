import { ReactElement } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type OptionType = {
  label: string;
  value: any;
};

type RadioProps = {
  name: string;
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

export default function RadioButton({
  name,
  className,
  error,
  errorMessage,
  label,
  register,
  required,
  options,
  onFieldChange,
  fieldValue,
}: RadioProps): ReactElement {
  const classNameNoRing = `${className} focus:outline-none focus:ring-0`;

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
      <div className="mt-2 space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              {...register}
              id={option.value}
              name={name}
              type="radio"
              value={option.value}
              onChange={onFieldChange}
              defaultChecked={fieldValue === option.value}
              className={
                error && classNameNoRing.includes("gray")
                  ? classNameNoRing.replaceAll("gray", "red")
                  : classNameNoRing
              }
            />
            <label
              htmlFor={option.value}
              className={`ml-3 block text-sm font-medium text-${
                error ? "red" : "gray"
              }-700`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {errorMessage && (
        <pre>
          <p className="text-xs font-small text-red-500">{errorMessage}</p>
        </pre>
      )}
    </>
  );
}
