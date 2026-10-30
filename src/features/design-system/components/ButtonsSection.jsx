import {
  ArrowRight,
  Download,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShowcaseSection } from "./ShowcaseSection";

export function ButtonsSection() {
  return (
    <ShowcaseSection
      id="buttons"
      title="Buttons"
      description="Semantic variants cover primary, supporting, destructive, and low-emphasis actions. Every button supports loading, disabled, icon, and full-width states."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Variants"
          description="Choose the lowest-emphasis variant that still communicates intent."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger" leftIcon={<Trash2 />}>
              Delete
            </Button>
          </div>
        </Card>

        <Card
          title="Sizes and states"
          description="Sizes follow a consistent control height from compact toolbars to primary forms."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" leftIcon={<Plus />}>
              Small
            </Button>
            <Button size="md">Medium</Button>
            <Button size="lg" rightIcon={<ArrowRight />}>
              Large
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-base-300 pt-5">
            <Button loading>Processing</Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline" leftIcon={<Download />}>
              Export
            </Button>
            <Button
              variant="ghost"
              iconOnly
              aria-label="Open settings"
              title="Open settings"
            >
              <Settings />
            </Button>
          </div>

          <div className="mt-5 max-w-sm">
            <Button fullWidth rightIcon={<ArrowRight />}>
              Continue setup
            </Button>
          </div>
        </Card>
      </div>
    </ShowcaseSection>
  );
}
