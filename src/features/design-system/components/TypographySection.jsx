import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { ShowcaseSection } from "./ShowcaseSection";

const typeSpecimens = [
  {
    label: "Display · 52 / 55",
    className: "text-display font-semibold",
    sample: "Build with clarity.",
  },
  {
    label: "Heading 1 · 36 / 41",
    className: "text-heading-1 font-semibold",
    sample: "Workspace overview",
  },
  {
    label: "Heading 2 · 24 / 31",
    className: "text-heading-2 font-semibold",
    sample: "Recent activity",
  },
  {
    label: "Heading 3 · 18 / 26",
    className: "text-heading-3 font-semibold",
    sample: "Team permissions",
  },
  {
    label: "Body · 14 / 24",
    className: "text-sm leading-6",
    sample:
      "Nexus Admin pairs clear hierarchy with generous whitespace so operators can scan complex data without friction.",
  },
  {
    label: "Label · 12 / 16",
    className: "text-label font-semibold uppercase",
    sample: "Account settings",
  },
  {
    label: "Caption · 12 / 20",
    className: "text-caption text-base-content/55",
    sample: "Last updated 12 minutes ago",
  },
];

const foundations = [
  {
    label: "Font family",
    value: "Inter",
    description: "Loaded with system fallbacks for reliable rendering.",
  },
  {
    label: "Spacing",
    value: "4px base",
    description: "All layout spacing uses a consistent 4px scale.",
  },
  {
    label: "Radii",
    value: "8–12px",
    description: "Controls use 8px; cards and dialogs use 12px.",
  },
];

export function TypographySection() {
  return (
    <ShowcaseSection
      id="typography"
      title="Typography"
      description="Inter anchors a calm, enterprise-grade hierarchy. Type sizes and line heights are defined as design tokens so headings, labels, and body copy stay consistent."
    >
      <div className="grid items-start gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <Card title="Type scale" description="Samples rendered with the shared type tokens.">
          <div className="divide-y divide-base-300">
            {typeSpecimens.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="w-40 shrink-0 font-mono text-[0.6875rem] text-base-content/45">
                  {item.label}
                </span>
                <p className={cn("min-w-0 text-base-content", item.className)}>
                  {item.sample}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card
            title="Foundations"
            description="Shared values behind every component."
          >
            <dl className="space-y-4">
              {foundations.map((foundation) => (
                <div
                  key={foundation.label}
                  className="rounded-control border border-base-300 bg-base-200/50 p-3.5"
                >
                  <dt className="text-label font-semibold uppercase text-base-content/45">
                    {foundation.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-base-content">
                    {foundation.value}
                  </dd>
                  <dd className="mt-1 text-xs leading-5 text-base-content/55">
                    {foundation.description}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Utility examples">
            <div className="space-y-2 font-mono text-xs text-base-content/65">
              <p className="rounded-control bg-base-200 px-2.5 py-1.5">
                text-heading-2
              </p>
              <p className="rounded-control bg-base-200 px-2.5 py-1.5">
                text-label uppercase
              </p>
              <p className="rounded-control bg-base-200 px-2.5 py-1.5">
                text-caption
              </p>
            </div>
          </Card>
        </div>
      </div>
    </ShowcaseSection>
  );
}
