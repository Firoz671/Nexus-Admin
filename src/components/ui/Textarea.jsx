import { useId } from "react";
import { cn } from "@/utils/cn";

export function Textarea({
  label,
  helperText,
  error,
  required = false,
  id,
  className,
  containerClassName,
  ...props
}) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const messageId = `${textareaId}-message`;
  const hasMessage = Boolean(error || helperText);

  return (
    <div className={cn("w-full", containerClassName)}>
      {label ? (
        <label
          htmlFor={textareaId}
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

      <textarea
        {...props}
        id={textareaId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={hasMessage ? messageId : undefined}
        className={cn(
          "textarea w-full border-base-300 bg-base-100 text-sm",
          error && "textarea-error",
          className,
        )}
      />

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
