import { formatNumber } from "@/utils/formatters";

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = formatNumber,
  labelFormatter,
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const heading =
    labelFormatter?.(label, payload) ??
    payload[0]?.payload?.tooltipLabel ??
    label;

  return (
    <div className="rounded-card border border-base-300 bg-base-100 px-3 py-2 text-xs shadow-lg">
      {heading ? (
        <p className="font-semibold text-base-content">{heading}</p>
      ) : null}

      <ul className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <li
            key={entry.dataKey ?? entry.name}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-1.5 text-base-content/65">
              <span
                className="size-2 rounded-full"
                style={{
                  backgroundColor:
                    entry.color ?? entry.payload?.fill ?? entry.fill,
                }}
                aria-hidden="true"
              />
              {entry.name}
            </span>
            <span className="font-semibold tabular-nums text-base-content">
              {valueFormatter(entry.value, entry)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
