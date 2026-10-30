import {
  ArrowDown,
  Boxes,
  MoonStar,
  Ruler,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const stats = [
  {
    label: "Reusable components",
    value: "12",
    icon: Boxes,
  },
  {
    label: "Theme modes",
    value: "2",
    icon: MoonStar,
  },
  {
    label: "Spacing base",
    value: "4px",
    icon: Ruler,
  },
];

export function OverviewSection() {
  return (
    <section id="overview" className="scroll-mt-28 pb-12">
      <div className="relative overflow-hidden rounded-card border border-base-300 bg-base-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-100 to-info/10" />
        <div
          className="absolute -right-16 -top-20 size-64 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 left-1/3 size-56 rounded-full bg-info/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">
              <Sparkles className="size-3" aria-hidden="true" />
              Phase 1 · Foundation
            </Badge>
            <Badge variant="success">Design tokens live</Badge>
          </div>

          <h1 className="mt-5 max-w-3xl text-heading-1 font-semibold text-base-content sm:text-display">
            Nexus Admin design system
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-base-content/65 sm:text-base">
            A professional, theme-aware component foundation for the Nexus Admin
            SaaS platform. Built with React 19, Tailwind CSS 4, and DaisyUI 5 for
            consistent product experiences at scale.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#buttons" className="btn btn-primary btn-md">
              Browse components
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <a href="#themes" className="btn btn-outline btn-md">
              Theme options
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-card border border-base-300/80 bg-base-100/80 p-4 backdrop-blur-sm"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold leading-tight text-base-content">
                      {stat.value}
                    </p>
                    <p className="text-xs text-base-content/55">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
