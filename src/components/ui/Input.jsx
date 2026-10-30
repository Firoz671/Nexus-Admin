import { useId } from "react";
import { cn } from "@/utils/cn";

export function Input({
  label,
  placeholder,
  helperText,
  error,
  disabled = false,
  required = false,
  leadingIcon = null,
  trailingIcon = null,
  id,
  type = "text",
  className,
  containerClassName,
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasMessage = Boolean(error || helperText);

  return (
    <div className={cn("w-full", containerClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
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

      <div
        className={cn(
          "input w-full border-base-300 bg-base-100",
          error && "input-error",
        )}
      >
        {leadingIcon ? (
          <span
            className="pointer-events-none shrink-0 text-base-content/50 [&_svg]:size-4"
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        ) : null}

        <input
          {...props}
          id={inputId}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className={cn("grow", className)}
        />

        {trailingIcon ? (
          <span
            className="pointer-events-none shrink-0 text-base-content/50 [&_svg]:size-4"
            aria-hidden="true"
          >
            {trailingIcon}
          </span>
        ) : null}
      </div>

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
