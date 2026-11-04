import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function SearchInput({
  value,
  onChange,
  label = "Search",
  placeholder = "Search…",
  id,
}) {
  return (
    <Input
      id={id}
      type="search"
      label={label}
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      leadingIcon={<Search />}
      onChange={(event) => onChange(event.target.value)}
      trailingAction={
        value ? (
          <button
            type="button"
            aria-label={`Clear ${label.toLowerCase()}`}
            className="flex size-6 items-center justify-center rounded-control text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-offset-2"
            onClick={() => onChange("")}
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        ) : null
      }
    />
  );
}
