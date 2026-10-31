import { cn } from "@/utils/cn";

export function MainContent({ children, className }) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={cn(
        "flex flex-1 flex-col px-4 py-6 outline-none sm:px-6 sm:py-8 lg:px-8",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl flex-1">{children}</div>
    </main>
  );
}
