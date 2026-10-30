import { Link, Outlet } from "react-router-dom";
import { BookOpen } from "lucide-react";
import nexusMark from "@/assets/icons/nexus-mark.svg";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SHOWCASE_SECTIONS } from "@/features/design-system/navigation";

export function ShowcaseLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-content focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-base-300/80 bg-base-100/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/design-system"
            className="flex min-w-0 items-center gap-3 rounded-control focus-visible:outline-offset-4"
          >
            <img
              src={nexusMark}
              alt=""
              width="36"
              height="36"
              className="size-9 shrink-0 rounded-control shadow-sm"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-base-content">
                Nexus Admin
              </span>
              <span className="block truncate text-xs text-base-content/55">
                Design System · Phase 1
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="info" size="sm" className="hidden sm:inline-flex">
              v0.1.0
            </Badge>
            <ThemeToggle />
          </div>
        </div>

        <div className="border-t border-base-300/70 lg:hidden">
          <nav
            aria-label="Design system sections"
            className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
          >
            {SHOWCASE_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-base-content/65 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-offset-2"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-10 px-4 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 py-10">
            <p className="text-label font-semibold uppercase text-base-content/45">
              On this page
            </p>

            <nav aria-label="Section navigation" className="mt-3 space-y-1">
              {SHOWCASE_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-control px-3 py-2 text-sm text-base-content/65 transition-colors hover:bg-base-100 hover:text-base-content focus-visible:outline-offset-2"
                >
                  {section.label}
                </a>
              ))}
            </nav>

            <div className="mt-8 rounded-card border border-base-300 bg-base-100 p-4">
              <div className="flex size-8 items-center justify-center rounded-control bg-primary/10 text-primary">
                <BookOpen className="size-4" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm font-semibold text-base-content">
                Documentation first
              </p>
              <p className="mt-1 text-xs leading-5 text-base-content/60">
                Every primitive in this page is reusable, keyboard friendly, and
                powered by semantic theme tokens.
              </p>
            </div>
          </div>
        </aside>

        <main
          id="main-content"
          className="min-w-0 flex-1 pb-16 pt-8 sm:pt-10"
        >
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-base-300 bg-base-100">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-base-content/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Nexus Admin · Phase 1 foundation and design system</p>
          <a
            href="#overview"
            className="w-fit rounded-control font-medium text-base-content/70 transition-colors hover:text-primary focus-visible:outline-offset-4"
          >
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}
