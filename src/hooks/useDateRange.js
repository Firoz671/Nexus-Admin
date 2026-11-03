import { useState } from "react";
import {
  createDateRange,
  DEFAULT_DATE_RANGE_PRESET,
} from "@/utils/dateRange";

export function useDateRange(initialPreset = DEFAULT_DATE_RANGE_PRESET) {
  const [range, setRange] = useState(() => createDateRange(initialPreset));

  return { range, setRange };
}
