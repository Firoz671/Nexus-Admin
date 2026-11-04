import { cn } from "@/utils/cn";

export function DetailGrid({ items, className }) {
  return (
    <dl className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-base-content/60">
            {item.label}
          </dt>
          <dd className="mt-1 break-words text-sm font-medium text-base-content">
            {item.value == null || item.value === "" ? "—" : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
