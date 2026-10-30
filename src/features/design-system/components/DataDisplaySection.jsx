import { Clock, FileText, MoreHorizontal } from "lucide-react";
import avatarSample from "@/assets/images/avatar-sample.svg";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShowcaseSection } from "./ShowcaseSection";

const avatarSizes = ["xs", "sm", "md", "lg", "xl"];

const invoiceRows = [
  { customer: "Acme Inc.", plan: "Enterprise", status: "Paid" },
  { customer: "Northwind Labs", plan: "Growth", status: "Pending" },
  { customer: "Vertex Studio", plan: "Starter", status: "Failed" },
  { customer: "Orbit Systems", plan: "Enterprise", status: "Scheduled" },
];

const statusVariants = {
  Paid: "success",
  Pending: "warning",
  Failed: "danger",
  Scheduled: "info",
};

export function BadgesSection() {
  return (
    <ShowcaseSection
      id="badges"
      title="Badges"
      description="Compact status labels use semantic colors with guaranteed foreground contrast. Use them for state, not as decorative accents."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Variants"
          description="Five semantic variants plus compact sizing for dense tables."
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="danger">Failed</Badge>
            <Badge variant="info">Scheduled</Badge>
            <Badge variant="neutral">Draft</Badge>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-base-300 pt-5">
            <Badge variant="success" size="sm">
              Small
            </Badge>
            <Badge variant="info" size="sm">
              Compact
            </Badge>
            <Badge variant="neutral" size="sm">
              Table ready
            </Badge>
          </div>
        </Card>

        <Card
          title="Status in context"
          description="Semantic colors remain legible against both theme surfaces."
        >
          <ul className="divide-y divide-base-300">
            {invoiceRows.map((row) => (
              <li
                key={row.customer}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-base-content">
                    {row.customer}
                  </p>
                  <p className="text-xs text-base-content/50">{row.plan}</p>
                </div>
                <Badge variant={statusVariants[row.status]} size="sm">
                  {row.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </ShowcaseSection>
  );
}

export function CardsSection() {
  return (
    <ShowcaseSection
      id="cards"
      title="Cards"
      description="Flexible surfaces for grouped content. Cards support a standard title and description, a custom header, and an optional footer."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Monthly usage"
          description="Standard title, description, content, and footer composition."
          footer={
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-xs text-base-content/50">
                <Clock className="size-3.5" aria-hidden="true" />
                Updated 8 minutes ago
              </span>
              <Button variant="outline" size="sm">
                View report
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Seats", value: "48" },
              { label: "Projects", value: "12" },
              { label: "API calls", value: "84k" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-control bg-base-200 px-3 py-3"
              >
                <p className="text-lg font-semibold text-base-content">
                  {metric.value}
                </p>
                <p className="text-xs text-base-content/50">{metric.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-start gap-3">
              <Avatar
                src={avatarSample}
                alt="Alex Morgan"
                name="Alex Morgan"
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-base-content">
                    Alex Morgan
                  </h3>
                  <Badge variant="success" size="sm">
                    Owner
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-base-content/50">
                  Requested access to the Billing workspace
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label="More request options"
              >
                <MoreHorizontal />
              </Button>
            </div>
          }
          footer={
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" size="sm">
                Dismiss
              </Button>
              <Button size="sm">Review request</Button>
            </div>
          }
        >
          <div className="flex items-start gap-3 rounded-control bg-base-200 p-3.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-control bg-base-100 text-base-content/60">
              <FileText className="size-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-base-content">
                Custom header and footer
              </p>
              <p className="mt-1 text-xs leading-5 text-base-content/55">
                Compose richer cards with avatars, metadata, and action groups
                while keeping consistent padding and borders.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </ShowcaseSection>
  );
}

export function AvatarsSection() {
  return (
    <ShowcaseSection
      id="avatars"
      title="Avatars"
      description="Profile imagery with automatic initials fallback, accessible labels, and five sizes for tables, cards, and navigation."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Sizes"
          description="Image avatars scale consistently from compact tables to profile headers."
        >
          <div className="flex flex-wrap items-end gap-5">
            {avatarSizes.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Avatar
                  src={avatarSample}
                  alt="Alex Morgan"
                  name="Alex Morgan"
                  size={size}
                />
                <span className="font-mono text-[0.6875rem] uppercase text-base-content/45">
                  {size}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Fallback initials"
          description="Missing or broken images fall back to initials derived from the person's name."
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar name="Jordan Lee" size="lg" />
              <span className="text-xs text-base-content/50">Jordan Lee</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="Priya Shah" size="lg" />
              <span className="text-xs text-base-content/50">Priya Shah</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="Marcus Chen" size="lg" />
              <span className="text-xs text-base-content/50">Marcus Chen</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="lg" />
              <span className="text-xs text-base-content/50">Unknown</span>
            </div>
          </div>
        </Card>
      </div>
    </ShowcaseSection>
  );
}
