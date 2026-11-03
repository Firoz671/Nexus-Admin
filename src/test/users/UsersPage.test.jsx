import { beforeEach, describe, expect, it } from "vitest";
import {
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";
import { useAuthStore } from "@/store/authStore";
import { signInAs } from "../helpers/auth";

function renderUsersPage() {
  window.history.replaceState({}, "", "/users");
  return render(<App />);
}

async function getUsersTable() {
  return screen.findByRole("table", { name: "Users" });
}

async function searchUsers(user, value) {
  const search = screen.getByRole("searchbox", { name: "Search users" });

  await user.clear(search);
  await user.type(search, value);
}

function getSummaryValue(label) {
  return within(screen.getByText(label).parentElement);
}

describe("UsersPage", () => {
  beforeEach(() => {
    signInAs("admin");
  });

  it("renders summary metrics and the paginated user directory", async () => {
    renderUsersPage();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Users" }),
    ).toBeInTheDocument();

    const table = await getUsersTable();

    expect(getSummaryValue("Total users").getByText("24")).toBeInTheDocument();
    expect(getSummaryValue("Active users").getByText("19")).toBeInTheDocument();
    expect(
      getSummaryValue("Inactive users").getByText("5"),
    ).toBeInTheDocument();
    expect(
      getSummaryValue("Administrators").getByText("4"),
    ).toBeInTheDocument();

    expect(within(table).getByText("Natalie Cole")).toBeInTheDocument();
    expect(within(table).getByText("Chloe Dubois")).toBeInTheDocument();
    expect(within(table).queryByText("Alex Morgan")).not.toBeInTheDocument();
    expect(
      screen.getByText(/24 matching users/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeInTheDocument();
  });

  it("searches and filters users by role and status", async () => {
    const user = userEvent.setup();

    renderUsersPage();
    const table = await getUsersTable();

    await searchUsers(user, "priya");

    await waitFor(() => {
      expect(within(table).getByText("Priya Shah")).toBeInTheDocument();
    });
    expect(within(table).queryByText("Natalie Cole")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Clear filters" }),
    );

    await waitFor(() => {
      expect(within(table).getByText("Natalie Cole")).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Role" }),
      "admin",
    );

    await waitFor(() => {
      expect(within(table).getByText("Alex Morgan")).toBeInTheDocument();
    });
    expect(within(table).queryByText("Natalie Cole")).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Status" }),
      "inactive",
    );

    await waitFor(() => {
      expect(within(table).getByText("Ethan Brooks")).toBeInTheDocument();
    });
    expect(within(table).queryByText("Alex Morgan")).not.toBeInTheDocument();
    expect(
      screen.getByText(/1 matching user$/i),
    ).toBeInTheDocument();
  });

  it("protects the signed-in account and syncs self profile edits", async () => {
    const user = userEvent.setup();

    renderUsersPage();
    const table = await getUsersTable();

    await searchUsers(user, "alex morgan");

    await waitFor(() => {
      expect(within(table).getByText("Alex Morgan")).toBeInTheDocument();
    });

    await user.click(
      within(table).getByRole("button", {
        name: "Actions for Alex Morgan",
      }),
    );

    expect(
      screen.getByRole("menuitem", { name: "Deactivate user" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("menuitem", { name: "Delete user" }),
    ).toBeDisabled();

    await user.click(screen.getByRole("menuitem", { name: "Edit user" }));

    const dialog = await screen.findByRole("dialog", { name: "Edit user" });

    expect(
      within(dialog).getByText("Protected account fields"),
    ).toBeInTheDocument();
    expect(within(dialog).queryByRole("combobox")).not.toBeInTheDocument();
    expect(
      within(dialog).queryByLabelText("Email"),
    ).not.toBeInTheDocument();

    const nameInput = within(dialog).getByLabelText(/full name/i);

    await user.clear(nameInput);
    await user.type(nameInput, "Alex Morgan-Smith");
    await user.click(
      within(dialog).getByRole("button", { name: "Save changes" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Edit user" }),
      ).not.toBeInTheDocument();
    });
    expect(useAuthStore.getState().user.name).toBe("Alex Morgan-Smith");
  });

  it("creates a user and surfaces duplicate email conflicts", async () => {
    const user = userEvent.setup();

    renderUsersPage();
    const table = await getUsersTable();

    await user.click(screen.getByRole("button", { name: "Add user" }));

    let dialog = await screen.findByRole("dialog", { name: "Create user" });

    await user.type(
      within(dialog).getByLabelText(/full name/i),
      "Taylor Reed",
    );
    await user.type(
      within(dialog).getByLabelText(/email/i),
      "taylor.reed@nexus.test",
    );
    await user.type(
      within(dialog).getByLabelText("Department"),
      "Operations",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Create user" }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Create user" }),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(within(table).getByText("Taylor Reed")).toBeInTheDocument();
    });
    expect(screen.getByText("User created successfully.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add user" }));
    dialog = await screen.findByRole("dialog", { name: "Create user" });

    await user.type(
      within(dialog).getByLabelText(/full name/i),
      "Duplicate Account",
    );
    await user.type(
      within(dialog).getByLabelText(/email/i),
      "admin@nexus.test",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Create user" }),
    );

    expect(
      await within(dialog).findByText(
        "A user with this email already exists.",
      ),
    ).toBeInTheDocument();
  });

  it("deactivates and deletes another user with confirmations", async () => {
    const user = userEvent.setup();

    renderUsersPage();
    const table = await getUsersTable();

    await searchUsers(user, "priya shah");

    await waitFor(() => {
      expect(within(table).getByText("Priya Shah")).toBeInTheDocument();
    });

    await user.click(
      within(table).getByRole("button", {
        name: "Actions for Priya Shah",
      }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: "Deactivate user" }),
    );

    const confirmDeactivate = await screen.findByRole("dialog", {
      name: "Deactivate Priya Shah?",
    });

    await user.click(
      within(confirmDeactivate).getByRole("button", {
        name: "Deactivate user",
      }),
    );

    await waitFor(() => {
      const row = within(table).getByText("Priya Shah").closest("tr");

      expect(within(row).getByText("Inactive")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Priya Shah was deactivated."),
    ).toBeInTheDocument();

    await user.click(
      within(table).getByRole("button", {
        name: "Actions for Priya Shah",
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Delete user" }));

    const confirmDelete = await screen.findByRole("dialog", {
      name: "Delete Priya Shah?",
    });

    await user.click(
      within(confirmDelete).getByRole("button", { name: "Delete user" }),
    );

    await waitFor(() => {
      expect(within(table).queryByText("Priya Shah")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Priya Shah was deleted.")).toBeInTheDocument();
  });
});
