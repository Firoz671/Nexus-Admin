import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { ShowcaseSection } from "./ShowcaseSection";

const brandColors = [
  {
    name: "Primary",
    token: "--color-primary",
    className: "bg-primary",
    usage: "Primary actions and focus",
  },
  {
    name: "Secondary",
    token: "--color-secondary",
    className: "bg-secondary",
    usage: "Supporting actions",
  },
  {
    name: "Success",
    token: "--color-success",
    className: "bg-success",
    usage: "Positive outcomes",
  },
  {
    name: "Warning",
    token: "--color-warning",
    className: "bg-warning",
    usage: "Needs attention",
  },
  {
    name: "Danger",
    token: "--color-error",
    className: "bg-error",
    usage: "Destructive actions",
  },
  {
    name: "Info",
    token: "--color-info",
    className: "bg-info",
    usage: "Contextual guidance",
  },
  {
    name: "Neutral",
    token: "--color-neutral",
    className: "bg-neutral",
    usage: "Quiet emphasis",
  },
];

const surfaceColors = [
  {
    name: "Base 100",
    token: "--color-base-100",
    className: "bg-base-100",
    description: "Cards and elevated surfaces",
  },
  {
    name: "Base 200",
    token: "--color-base-200",
    className: "bg-base-200",
    description: "Application canvas",
  },
  {
    name: "Base 300",
    token: "--color-base-300",
    className: "bg-base-300",
    description: "Borders and dividers",
  },
  {
    name: "Base content",
    token: "--color-base-content",
    className: "bg-base-content",
    description: "Primary text color",
  },
];

const rules = [
  "Use semantic utilities such as bg-primary and text-base-content.",
  "Let components inherit dark mode instead of hardcoding colors.",
  "Reserve status colors for feedback, not decoration.",
];

export function ColorSection() {
  return (
    <ShowcaseSection
      id="colors"
      title="Color system"
      description="A restrained, accessible palette mapped to semantic DaisyUI theme tokens. Every swatch adapts automatically when the theme changes."
    >
      <div className="grid items-start gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card
          title="Brand and semantic colors"
          description="The core palette used across actions, feedback, and data states."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {brandColors.map((color) => (
              <div
                key={color.token}
                className="overflow-hidden rounded-control border border-base-300"
              >
                <div className={cn("h-20 w-full", color.className)} />
                <div className="bg-base-100 p-3">
                  <p className="text-sm font-semibold text-base-content">
                    {color.name}
                  </p>
                  <code className="mt-0.5 block truncate font-mono text-[0.6875rem] text-base-content/45">
                    {color.token}
                  </code>
                  <p className="mt-1.5 text-xs text-base-content/55">
                    {color.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card
            title="Surface tokens"
            description="Layered backgrounds keep dense admin screens readable."
          >
            <div className="grid grid-cols-2 gap-3">
              {surfaceColors.map((surface) => (
                <div
                  key={surface.token}
                  className="overflow-hidden rounded-control border border-base-300"
                >
                  <div
                    className={cn(
                      "h-14 w-full border-b border-base-300",
                      surface.className,
                    )}
                  />
                  <div className="p-3">
                    <p className="text-xs font-semibold text-base-content">
                      {surface.name}
                    </p>
                    <p className="mt-1 text-[0.6875rem] leading-4 text-base-content/50">
                      {surface.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Working with tokens">
            <ul className="space-y-2.5">
              {rules.map((rule) => (
                <li key={rule} className="flex gap-2.5 text-sm text-base-content/65">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </ShowcaseSection>
  );
}
