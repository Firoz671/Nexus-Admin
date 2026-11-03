import { useId } from "react";
import { cn } from "@/utils/cn";

const sizeClasses = {
  sm: "select-sm text-sm",
  md: "select-md text-sm",
};

export function Select({
  label,
  helperText,
  error,
  required = false,
  id,
  size = "md",
  className,
  containerClassName,
  children,
  ...props
}) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;
  const hasMessage = Boolean(error || helperText);

  return (
    <div className={cn("w-full", containerClassName)}>
      {label ? (
        <label
          htmlFor={selectId}
          className="mb-1.5 flex items-center gap-1 text-sm font-medium text-base-content"
        >
          {label}
          {required ? (
            <span className="text-error" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <select
        {...props}
        id={selectId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={hasMessage ? messageId : undefined}
        className={cn(
          "select w-full border-base-300 bg-base-100",
          sizeClasses[size] ?? sizeClasses.md,
          error && "select-error",
          className,
        )}
      >
        {children}
      </select>

      {error ? (
        <p id={messageId} role="alert" className="mt-1.5 text-sm text-error">
          {error}
        </p>
      ) : helperText ? (
        <p id={messageId} className="mt-1.5 text-sm text-base-content/60">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
