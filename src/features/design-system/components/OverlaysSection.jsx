import {
  Check,
  Download,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ShowcaseSection } from "./ShowcaseSection";

const accessibilityChecks = [
  "Dialog semantics with an accessible title and description",
  "Focus moves into the dialog and is restored on close",
  "Escape, close button, and backdrop dismissal are supported",
  "Tab focus is trapped inside the active dialog",
];

const projectActions = [
  {
    id: "profile",
    label: "View profile",
    icon: <User />,
    onSelect: () => toast.success("Profile action selected"),
  },
  {
    id: "settings",
    label: "Project settings",
    icon: <Settings />,
    onSelect: () => toast.success("Settings action selected"),
  },
  {
    id: "export",
    label: "Export data",
    icon: <Download />,
    onSelect: () => toast.success("Export action selected"),
  },
  { type: "separator" },
  {
    id: "delete",
    label: "Delete project",
    icon: <Trash2 />,
    variant: "danger",
    onSelect: () => toast.error("Delete is disabled in this demo"),
  },
];

const filterActions = [
  { id: "all", label: "All projects", onSelect: () => {} },
  { id: "active", label: "Active only", onSelect: () => {} },
  { id: "archived", label: "Archived", onSelect: () => {} },
];

const keyboardShortcuts = [
  { action: "Open menu", keys: ["Enter", "Space", "↓"] },
  { action: "Move between items", keys: ["↑", "↓"] },
  { action: "Jump to first or last", keys: ["Home", "End"] },
  { action: "Close menu", keys: ["Esc", "Tab"] },
];

export function ModalSection() {
  const { isOpen, open, close } = useDisclosure();

  const handleSave = () => {
    close();
    toast.success("Workspace updated successfully.");
  };

  return (
    <ShowcaseSection
      id="modal"
      title="Modal"
      description="A dependency-free accessible dialog with focus management, keyboard dismissal, and an optional action footer."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Compose and confirm"
          description="Open a live dialog to verify focus, escape handling, and the confirmation footer."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={open}>Open modal</Button>
            <span className="text-xs text-base-content/50">
              Try Escape, the backdrop, or the close button.
            </span>
          </div>

          <div className="mt-5 rounded-control border border-base-300 bg-base-200/60 p-3.5 text-xs leading-5 text-base-content/55">
            The dialog renders through a portal, locks background scrolling, and
            restores focus to the trigger when closed.
          </div>
        </Card>

        <Card
          title="Accessibility checklist"
          description="The implementation covers the expected dialog interaction model."
        >
          <ul className="space-y-2.5">
            {accessibilityChecks.map((check) => (
              <li
                key={check}
                className="flex gap-2.5 text-sm text-base-content/65"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                {check}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Modal
        open={isOpen}
        onClose={close}
        title="Update workspace"
        description="Changes apply to every member of the Nexus Operations workspace."
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Workspace name"
            defaultValue="Nexus Operations"
            helperText="Use a name your team will recognize."
          />
          <Input
            label="Workspace slug"
            defaultValue="nexus-operations"
            leadingIcon={<span className="text-xs font-medium">/</span>}
            helperText="Used in URLs and API references."
          />
        </div>
      </Modal>
    </ShowcaseSection>
  );
}

export function DropdownSection() {
  return (
    <ShowcaseSection
      id="dropdown"
      title="Dropdown"
      description="A keyboard-friendly menu button with outside-click dismissal, arrow-key navigation, and destructive item styling."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Menu button"
          description="Trigger a live menu and select an item to publish a toast."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Dropdown trigger="Project actions" items={projectActions} />
            <Dropdown
              trigger="Filter by"
              items={filterActions}
              align="start"
            />
          </div>

          <p className="mt-5 border-t border-base-300 pt-5 text-xs leading-5 text-base-content/55">
            Menus close on outside click, selection, Escape, or Tab. Focus
            returns to the trigger after keyboard dismissal.
          </p>
        </Card>

        <Card
          title="Keyboard support"
          description="Expected interactions are available without a pointer."
        >
          <div className="space-y-2">
            {keyboardShortcuts.map((shortcut) => (
              <div
                key={shortcut.action}
                className="flex items-center justify-between gap-3 rounded-control bg-base-200/60 px-3 py-2"
              >
                <span className="text-sm text-base-content/65">
                  {shortcut.action}
                </span>
                <span className="flex flex-wrap justify-end gap-1">
                  {shortcut.keys.map((key) => (
                    <kbd
                      key={key}
                      className="rounded border border-base-300 bg-base-100 px-1.5 py-0.5 font-mono text-[0.6875rem] text-base-content/55"
                    >
                      {key}
                    </kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ShowcaseSection>
  );
}
