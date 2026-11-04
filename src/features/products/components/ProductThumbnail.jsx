import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/utils/cn";

const sizeClasses = {
  sm: "size-8 rounded-control",
  md: "size-10 rounded-control",
  lg: "size-16 rounded-card",
};

export function ProductThumbnail({ src, name, size = "md", className }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden border border-base-300 bg-base-200 text-base-content/60",
        sizeClasses[size] ?? sizeClasses.md,
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={`${name} product`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <Package
          className={cn(
            size === "lg" ? "size-6" : "size-4",
          )}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
