import { useState } from "react";
import {
  Plus,
  ShieldCheck,
  UserCheck,
  UserRoundX,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { Select } from "@/components/ui/Select";
import {
  ConfirmDialog,
  ManagementSummary,
  Pagination,
  SearchInput,
  TableSkeleton,
} from "@/components/management";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  MANAGEMENT_PAGE_SIZE,
  USER_STATUSES,
  USER_STATUS_LABELS,
} from "@/constants/management";
import { ROLE_LABELS } from "@/constants/permissions";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAuthStore } from "@/store/authStore";
import { UserDetailModal } from "../components/UserDetailModal";
import { UserFormModal } from "../components/UserFormModal";
import { UsersList } from "../components/UsersList";
import {
  useDeleteUser,
  useUpdateUserStatus,
  useUsers,
} from "../hooks/useUsers";

export function UsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [detailUserId, setDetailUserId] = useState(null);
  const [formState, setFormState] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebouncedValue(search, 250);
  const filters = {
    search: debouncedSearch,
    role,
    status,
    sortBy,
    sortOrder,
    page,
    pageSize: MANAGEMENT_PAGE_SIZE,
  };
  const usersQuery = useUsers(filters);
  const statusMutation = useUpdateUserStatus();
  const deleteMutation = useDeleteUser();
  const users = usersQuery.data?.items ?? [];
  const pagination = usersQuery.data?.pagination;
  const summary = usersQuery.data?.summary;
  const hasFilters = Boolean(search.trim() || role !== "all" || status !== "all");

  const handleSort = (nextSortBy) => {
    if (nextSortBy === sortBy) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(nextSortBy);
      setSortOrder(nextSortBy === "name" ? "asc" : "desc");
    }

    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
    setPage(1);
  };

  const requestStatusChange = (user, nextStatus) => {
    setStatusTarget({ user, nextStatus });
  };

  const confirmStatusChange = async () => {
    if (!statusTarget) {
      return;
    }

    try {
      await statusMutation.mutateAsync({
        id: statusTarget.user.id,
        status: statusTarget.nextStatus,
      });
      toast.success(
        `${statusTarget.user.name} was ${
          statusTarget.nextStatus === "active" ? "activated" : "deactivated"
        }.`,
      );
      setStatusTarget(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.name} was deleted.`);
      setDeleteTarget(null);

      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const summaryItems = [
    {
      id: "total",
      label: "Total users",
      value: summary?.total,
      icon: Users,
      tone: "primary",
    },
    {
      id: "active",
      label: "Active users",
      value: summary?.active,
      icon: UserCheck,
      tone: "success",
    },
    {
      id: "inactive",
      label: "Inactive users",
      value: summary?.inactive,
      icon: UserRoundX,
      tone: "neutral",
    },
    {
      id: "administrators",
      label: "Administrators",
      value: summary?.administrators,
      icon: ShieldCheck,
      tone: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace access"
        title="Users"
        description="Manage workspace members, roles, and account status. Both administrators and managers can access this module."
        actions={
          <Button
            leftIcon={<Plus />}
            onClick={() => setFormState({ mode: "create", user: null })}
          >
            Add user
          </Button>
        }
      />

      {usersQuery.isPending ? (
        <>
          <ManagementSummary isLoading itemCount={4} />
          <Card contentClassName="p-0">
            <TableSkeleton label="Loading users" />
          </Card>
        </>
      ) : usersQuery.isError ? (
        <ErrorState
          title="Unable to load users"
          description={usersQuery.error?.message}
          onRetry={() => usersQuery.refetch()}
        />
      ) : (
        <>
          <ManagementSummary items={summaryItems} />

          <section
            aria-label="Users directory"
            aria-busy={usersQuery.isFetching}
            className="space-y-4"
          >
            <Card contentClassName="p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_auto]">
                <SearchInput
                  label="Search users"
                  placeholder="Name or email"
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                />
                <Select
                  label="Role"
                  size="sm"
                  value={role}
                  onChange={(event) => {
                    setRole(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All roles</option>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Status"
                  size="sm"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All statuses</option>
                  {USER_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {USER_STATUS_LABELS[value]}
                    </option>
                  ))}
                </Select>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    disabled={!hasFilters}
                    className="w-full sm:w-auto"
                  >
                    Clear filters
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex min-h-5 flex-wrap items-center justify-between gap-2 text-xs text-base-content/50">
                <span>
                  {pagination?.totalItems
                    ? `${pagination.totalItems} matching user${
                        pagination.totalItems === 1 ? "" : "s"
                      }`
                    : "No matching users"}
                </span>
                {usersQuery.isFetching ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader size="xs" label="Updating users" />
                    Updating…
                  </span>
                ) : null}
              </div>
            </Card>

            {users.length === 0 ? (
              <EmptyState
                icon={<Users />}
                title={
                  hasFilters
                    ? "No users match these filters"
                    : "No users yet"
                }
                description={
                  hasFilters
                    ? "Try a different search term or clear the role and status filters."
                    : "Create the first workspace member to begin managing access."
                }
                action={
                  hasFilters ? (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  ) : (
                    <Button
                      leftIcon={<Plus />}
                      onClick={() =>
                        setFormState({ mode: "create", user: null })
                      }
                    >
                      Add user
                    </Button>
                  )
                }
              />
            ) : (
              <Card contentClassName="p-0">
                <UsersList
                  users={users}
                  currentUserId={currentUser?.id}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onView={(user) => setDetailUserId(user.id)}
                  onEdit={(user) =>
                    setFormState({ mode: "edit", user })
                  }
                  onChangeStatus={requestStatusChange}
                  onDelete={setDeleteTarget}
                />
              </Card>
            )}

            {pagination?.totalItems ? (
              <Pagination
                page={pagination.page}
                pageCount={pagination.totalPages}
                totalItems={pagination.totalItems}
                pageSize={pagination.pageSize}
                onPageChange={setPage}
                itemLabel="users"
              />
            ) : null}
          </section>
        </>
      )}

      {detailUserId ? (
        <UserDetailModal
          userId={detailUserId}
          onClose={() => setDetailUserId(null)}
        />
      ) : null}

      {formState ? (
        <UserFormModal
          mode={formState.mode}
          user={formState.user}
          isSelf={formState.user?.id === currentUser?.id}
          onClose={() => setFormState(null)}
          onSaved={() => {
            if (formState.mode === "create") {
              setPage(1);
            }
          }}
        />
      ) : null}

      {statusTarget ? (
        <ConfirmDialog
          title={`${
            statusTarget.nextStatus === "active" ? "Activate" : "Deactivate"
          } ${statusTarget.user.name}?`}
          description={
            statusTarget.nextStatus === "active"
              ? "This user will regain workspace access immediately. Their historical activity remains unchanged."
              : "This user will lose workspace access until an administrator or manager reactivates the account."
          }
          confirmLabel={
            statusTarget.nextStatus === "active"
              ? "Activate user"
              : "Deactivate user"
          }
          variant={
            statusTarget.nextStatus === "active" ? "primary" : "danger"
          }
          isLoading={statusMutation.isPending}
          onConfirm={confirmStatusChange}
          onClose={() => {
            if (!statusMutation.isPending) {
              setStatusTarget(null);
            }
          }}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title={`Delete ${deleteTarget.name}?`}
          description="This permanently removes the user from the workspace. This action cannot be undone."
          confirmLabel="Delete user"
          variant="danger"
          isLoading={deleteMutation.isPending}
          onConfirm={confirmDelete}
          onClose={() => {
            if (!deleteMutation.isPending) {
              setDeleteTarget(null);
            }
          }}
        />
      ) : null}
    </div>
  );
}
