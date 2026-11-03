import { Link } from "react-router-dom";
import {
  ChartNoAxesCombined,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import nexusMark from "@/assets/icons/nexus-mark.svg";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { DASHBOARD_PATH } from "@/constants/navigation";

const highlights = [
  {
    id: "session",
    icon: ShieldCheck,
    title: "Persistent mock sessions",
    description:
      "Tokens survive refreshes while the current user is restored through the mock API.",
  },
  {
    id: "roles",
    icon: Users,
    title: "Role-aware navigation",
    description:
      "Administrator and manager roles receive different route and navigation access.",
  },
  {
    id: "api",
    icon: ChartNoAxesCombined,
    title: "Realistic API flow",
    description:
      "Axios, React Query, and MSW model the same flow a real backend would use.",
  },
];

export function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-base-200">
      <a
        href="#login-form"
        className="sr-only z-50 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-content focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to sign in
      </a>

      <header className="absolute right-3 top-3 z-20 sm:right-5 sm:top-5">
        <ThemeToggle />
      </header>

      <div className="mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-[1.08fr_1fr]">
        <aside className="hidden flex-col justify-between border-r border-base-300 bg-base-100 p-10 lg:flex xl:p-14">
          <div>
            <Link
              to={DASHBOARD_PATH}
              aria-label="Nexus Admin dashboard"
              className="inline-flex items-center gap-3 rounded-control focus-visible:outline-offset-4"
            >
              <img
                src={nexusMark}
                alt=""
                width="40"
                height="40"
                className="size-10 rounded-control shadow-sm"
              />
              <span>
                <span className="block text-sm font-semibold text-base-content">
                  Nexus Admin
                </span>
                <span className="block text-xs text-base-content/55">
                  SaaS administration console
                </span>
              </span>
            </Link>

            <div className="mt-16 max-w-lg">
              <Badge variant="info" size="sm">
                <Sparkles className="size-3" aria-hidden="true" />
                Phase 3 · Mock authentication
              </Badge>
              <p className="mt-5 text-heading-1 font-semibold text-base-content">
                A realistic auth foundation for the Nexus workspace.
              </p>
              <p className="mt-4 text-sm leading-6 text-base-content/60">
                Sign in with a demo account to explore protected routes,
                persistent sessions, and role-based access without a real
                backend.
              </p>
            </div>

            <ul className="mt-10 space-y-5">
              {highlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                  <li key={highlight.id} className="flex gap-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-base-content">
                        {highlight.title}
                      </p>
                      <p className="mt-1 max-w-sm text-xs leading-5 text-base-content/60">
                        {highlight.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-start gap-2.5 rounded-card border border-base-300 bg-base-200/60 p-3.5 text-xs leading-5 text-base-content/55">
            <LockKeyhole
              className="mt-0.5 size-4 shrink-0 text-base-content/45"
              aria-hidden="true"
            />
            <p>
              Demonstration only. Credentials are public, tokens are simulated,
              and MSW intercepts API requests. This is not production-grade
              authentication.
            </p>
          </div>
        </aside>

        <main className="flex items-center justify-center px-4 py-14 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <Link
              to={DASHBOARD_PATH}
              aria-label="Nexus Admin dashboard"
              className="mb-8 inline-flex items-center gap-3 rounded-control lg:hidden"
            >
              <img
                src={nexusMark}
                alt=""
                width="40"
                height="40"
                className="size-10 rounded-control shadow-sm"
              />
              <span>
                <span className="block text-sm font-semibold text-base-content">
                  Nexus Admin
                </span>
                <span className="block text-xs text-base-content/55">
                  SaaS administration console
                </span>
              </span>
            </Link>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
