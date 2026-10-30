import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useDisclosure } from "@/hooks/useDisclosure";

function ModalHarness() {
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <Button onClick={open}>Open modal</Button>
      <Modal
        open={isOpen}
        onClose={close}
        title="Update workspace"
        description="Changes apply to every workspace member."
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button onClick={close}>Save changes</Button>
          </>
        }
      >
        <p>Workspace settings</p>
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it("opens, moves focus into the dialog, and closes from the close button", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    const trigger = screen.getByRole("button", { name: "Open modal" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Update workspace" });

    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText("Changes apply to every workspace member."),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        within(dialog).getByRole("button", { name: "Close dialog" }),
      ).toHaveFocus();
    });

    await user.click(
      within(dialog).getByRole("button", { name: "Close dialog" }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByRole("button", { name: "Open modal" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
