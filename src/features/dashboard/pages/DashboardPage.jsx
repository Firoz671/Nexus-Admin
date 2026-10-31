import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  LayoutDashboard,
  Package,
  PanelLeft,
  Settings,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/shared/PageHeader";

const quickLinks = [
  {
    id: "users",
    title: "Users",
    description: "A future home for team members, roles, and access.",
    path: "/users",
    icon: Users,
  },
  {
    id: "products",
    title: "Products",
    description: "A future home for catalog and inventory management.",
    path: "/products",
    icon: Package,
  },
  {
    id: "orders",
    title: "Orders",
    description: "A future home for order workflows and fulfillment.",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "A future home for reporting and business insights.",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "A future home for alerts and delivery preferences.",
    path: "/notifications",
    icon: Bell,
  },
  {
    id: "settings",
    title: "Settings",
    description: "A future home for workspace and account configuration.",
    path: "/settings",
    icon: Settings,
  },
];

const shellCapabilities = [
  {
    id: "navigation",
    title: "Persistent navigation",
    description:
      "Sidebar routes, active states, and breadcrumbs are fully wired.",
  },
  {
    id: "sidebar",
    title: "Collapsible sidebar",
    description:
      "The desktop sidebar expands and collapses without overlapping content.",
  },
  {
    id: "mobile",
    title: "Mobile drawer",
    description:
      "Navigation adapts to a keyboard-accessible drawer on small screens.",
  },
  {
    id: "theming",
    title: "Light and dark themes",
    description:
      "The Phase 1 theme toggle and persisted preference are used throughout.",
  },
];

export function DashboardPage() {
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Workspace overview"
        title="Overview"
        description="A preview of the Nexus Admin application shell. Navigation, layout, and theming are functional; business modules are placeholders."
        actions={
          <span className="inline-flex items-center gap-2 rounded-control border border-base-300 bg-base-100 px-3 py-2 text-xs font-medium text-base-content/65">
            <CalendarDays className="size-4 text-base-content/50" aria-hidden="true" />
            {today}
          </span>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">
                <Sparkles className="size-3" aria-hidden="true" />
                Phase 2 · Shell preview
              </Badge>
              <Badge variant="neutral" size="sm">
                Demonstration content
              </Badge>
            </div>

            <h2 className="mt-4 text-heading-2 font-semibold text-base-content">
              Welcome back, Alex
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/60">
              This overview demonstrates the application shell only. It does not
              display live business data, revenue metrics, or user statistics.
              Use the quick access links to validate navigation between the
              prepared module routes.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link to="/users" className="btn btn-primary btn-sm gap-2">
                Explore module previews
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link to="/design-system" className="btn btn-ghost btn-sm">
                Open design system
              </Link>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3 lg:w-72 lg:grid-cols-1">
            <div className="rounded-card border border-base-300 bg-base-200/60 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-base-content/45">
                Navigation modules
              </p>
              <p className="mt-1 text-2xl font-semibold text-base-content">7</p>
              <p className="mt-1 text-xs text-base-content/55">
                Routes prepared in this phase
              </p>
            </div>
            <div className="rounded-card border border-base-300 bg-base-200/60 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-base-content/45">
                Theme modes
              </p>
              <p className="mt-1 text-2xl font-semibold text-base-content">2</p>
              <p className="mt-1 text-xs text-base-content/55">
                Light and dark, persisted locally
              </p>
            </div>
            <div className="rounded-card border border-base-300 bg-base-200/60 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-base-content/45">
                Shell status
              </p>
              <p className="mt-1 text-2xl font-semibold text-base-content">
                Phase 2
              </p>
              <p className="mt-1 text-xs text-base-content/55">
                Layout and navigation complete
              </p>
            </div>
          </div>
        </div>
      </Card>

      <section aria-labelledby="quick-access-heading">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="quick-access-heading"
              className="text-heading-3 font-semibold text-base-content"
            >
              Quick access
            </h2>
            <p className="mt-1 text-sm text-base-content/60">
              Every card opens a placeholder route. Modules will be built in
              later phases.
            </p>
          </div>
          <Badge variant="neutral" size="sm" className="w-fit">
            Placeholder routes
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.id}
                to={link.path}
                className="group flex flex-col rounded-card border border-base-300 bg-base-100 p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-base-100 focus-visible:outline-offset-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-control bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <Badge variant="neutral" size="sm">
                    Planned
                  </Badge>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-base-content">
                  {link.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-base-content/60">
                  {link.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Open preview
                  <ArrowUpRight
                    className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card
          title="Application shell status"
          description="Foundation capabilities available in this build."
        >
          <ul className="space-y-4">
            {shellCapabilities.map((capability) => (
              <li key={capability.id} className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-base-content">
                    {capability.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-base-content/60">
                    {capability.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Preview notes"
          description="What this page intentionally does not include."
        >
          <div className="flex gap-3 rounded-control border border-base-300 bg-base-200/60 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-base-100 text-base-content/60">
              <PanelLeft className="size-4" aria-hidden="true" />
            </span>
            <p className="text-xs leading-5 text-base-content/65">
              No API requests, business metrics, charts, or tables are connected
              in Phase 2. Placeholder content exists only to validate the shell.
            </p>
          </div>

          <ul className="mt-4 space-y-2.5 text-xs leading-5 text-base-content/60">
            <li className="flex items-center gap-2">
              <Smartphone className="size-3.5 shrink-0" aria-hidden="true" />
              Responsive at desktop, tablet, and mobile widths.
            </li>
            <li className="flex items-center gap-2">
              <LayoutDashboard
                className="size-3.5 shrink-0"
                aria-hidden="true"
              />
              Breadcrumbs reflect the current route.
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
              Existing Phase 1 tokens and components are reused.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
