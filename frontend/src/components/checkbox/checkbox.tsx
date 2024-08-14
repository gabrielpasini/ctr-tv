type Link = {
  label: string;
  href: string;
};

interface Checkbox {
  label: string;
  link: Link;
  value: boolean;
  setValue: (value: boolean) => void;
  className: string;
  error?: boolean;
  errorMessage?: string;
}

export default function Checkbox({
  className,
  value,
  setValue,
  label,
  link,
  error,
  errorMessage,
}: Checkbox) {
  return (
    <>
      <div className="flex items-center">
        <input
          id="default-checkbox"
          type="checkbox"
          checked={value}
          onChange={(event) => setValue(event.target.checked)}
          className={
            error && className.includes("gray")
              ? className.replaceAll("gray", "red")
              : className
          }
        />
        <label
          htmlFor="default-checkbox"
          className={`ml-3 block text-sm font-medium text-${
            error ? "red" : "gray"
          }-700`}
        >
          {label}
          {link !== undefined && (
            <a
              target="_blank"
              href={link.href}
              className="pointer text-highlight hover:text-highlight-40"
            >
              {link.label}
            </a>
          )}
        </label>
      </div>
      {errorMessage && (
        <pre>
          <p className="text-xs font-small text-red-500">{errorMessage}</p>
        </pre>
      )}
    </>
  );
}
