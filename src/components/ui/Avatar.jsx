import { useState } from "react";
import { cn } from "@/utils/cn";

const sizeClasses = {
  xs: "size-7 text-[0.625rem]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
};

function getInitials(name) {
  if (!name?.trim()) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function Avatar({ src, alt = "", name, size = "md", className }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = Boolean(src) && failedSrc !== src;
  const label = name || alt;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary ring-1 ring-base-300",
        sizeClasses[size] ?? sizeClasses.md,
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span role="img" aria-label={label || "Avatar"}>
          {getInitials(label)}
        </span>
      )}
    </span>
  );
}
