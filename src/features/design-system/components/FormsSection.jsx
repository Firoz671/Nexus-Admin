import { AtSign, Mail, Search, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ShowcaseSection } from "./ShowcaseSection";

export function FormsSection() {
  return (
    <ShowcaseSection
      id="inputs"
      title="Inputs"
      description="Accessible form fields with explicit labels, helper text, validation messaging, and optional leading or trailing icons. Error messages are announced to assistive technology."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Text inputs"
          description="Labels stay visible, icons stay secondary, and helper text explains expected input."
        >
          <div className="space-y-5">
            <Input
              label="Workspace name"
              placeholder="Nexus Operations"
              helperText="This name appears in navigation and billing receipts."
            />

            <Input
              label="Search"
              type="search"
              placeholder="Search projects, people, or invoices"
              leadingIcon={<Search />}
            />

            <Input
              label="Work email"
              type="email"
              placeholder="you@company.com"
              leadingIcon={<Mail />}
              trailingIcon={<AtSign />}
              autoComplete="email"
            />
          </div>
        </Card>

        <Card
          title="Validation and states"
          description="Errors are connected with aria-describedby and marked with aria-invalid."
        >
          <div className="space-y-5">
            <Input
              label="Work email"
              type="email"
              defaultValue="alex@"
              error="Enter a valid work email address."
              leadingIcon={<Mail />}
            />

            <Input
              label="Company name"
              placeholder="Acme Inc."
              required
              helperText="Required for workspace setup."
            />

            <Input
              label="Workspace ID"
              defaultValue="nexus-ops-01"
              disabled
              leadingIcon={<ShieldCheck />}
              helperText="Workspace IDs are assigned by the platform."
            />
          </div>
        </Card>
      </div>
    </ShowcaseSection>
  );
}
