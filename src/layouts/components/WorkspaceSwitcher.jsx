import { useState } from "react";
import { Building2, Check } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";

const WORKSPACES = Object.freeze([
  {
    id: "nexus-technologies",
    name: "Nexus Technologies",
    note: "Enterprise workspace",
  },
  {
    id: "creative-studio",
    name: "Creative Studio",
    note: "Design workspace",
  },
  {
    id: "development-workspace",
    name: "Development Workspace",
    note: "Engineering workspace",
  },
]);

export function WorkspaceSwitcher({ className }) {
  const [activeId, setActiveId] = useState(WORKSPACES[0].id);
  const activeWorkspace =
    WORKSPACES.find((workspace) => workspace.id === activeId) ??
    WORKSPACES[0];

  const items = WORKSPACES.map((workspace) => ({
    id: workspace.id,
    label: workspace.name,
    icon:
      workspace.id === activeWorkspace.id ? <Check /> : <Building2 />,
    onSelect: () => setActiveId(workspace.id),
  }));

  return (
    <Dropdown
      className={className}
      triggerAriaLabel={`Switch workspace: ${activeWorkspace.name}`}
      triggerClassName="gap-2 border-base-300 bg-base-100 font-medium"
      trigger={
        <>
          <Building2
            className="size-4 shrink-0 text-base-content/60"
            aria-hidden="true"
          />
          <span className="hidden max-w-36 truncate md:inline">
            {activeWorkspace.name}
          </span>
        </>
      }
      items={items}
    />
  );
}
