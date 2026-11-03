import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/management/DataTable";
import { StatusBadge } from "@/components/management/StatusBadge";
import { ROLE_LABELS, ROLES } from "@/constants/permissions";
import { formatDate } from "@/utils/formatters";
import { UserActionsMenu } from "./UserActionsMenu";

function RoleBadge({ role }) {
  return (
    <Badge variant={role === ROLES.ADMIN ? "info" : "neutral"}>
      {ROLE_LABELS[role] ?? role}
    </Badge>
  );
}

function UserIdentity({ user, currentUserId }) {
  const isSelf = user.id === currentUserId;

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar name={user.name} src={user.avatar} size="sm" />
      <div className="min-w-0">
        <p className="truncate font-medium text-base-content">{user.name}</p>
        {isSelf ? (
          <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-primary">
            You
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function UsersList({
  users,
  currentUserId,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onChangeStatus,
  onDelete,
}) {
  const columns = [
    {
      id: "user",
      header: "User",
      cell: (user) => (
        <UserIdentity user={user} currentUserId={currentUserId} />
      ),
    },
    {
      id: "email",
      header: "Email",
      className: "max-w-56",
      cell: (user) => (
        <span className="block truncate text-base-content/65">
          {user.email}
        </span>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (user) => <RoleBadge role={user.role} />,
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => <StatusBadge status={user.status} />,
    },
    {
      id: "createdAt",
      header: "Registered",
      sortKey: "createdAt",
      className: "whitespace-nowrap text-base-content/60",
      cell: (user) => formatDate(user.createdAt),
    },
    {
      id: "lastActiveAt",
      header: "Last active",
      className: "whitespace-nowrap text-base-content/60",
      cell: (user) => formatDate(user.lastActiveAt),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (user) => (
        <UserActionsMenu
          user={user}
          isSelf={user.id === currentUserId}
          onView={onView}
          onEdit={onEdit}
          onChangeStatus={onChangeStatus}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return (
    <>
      <div className="hidden p-4 sm:p-5 lg:block">
        <DataTable
          caption="Users"
          columns={columns}
          rows={users}
          getRowKey={(user) => user.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          minWidthClassName="min-w-[900px]"
        />
      </div>

      <ul className="divide-y divide-base-300/70 lg:hidden">
        {users.map((user) => (
          <li key={user.id} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <Avatar name={user.name} src={user.avatar} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-base-content">
                    {user.name}
                    {user.id === currentUserId ? (
                      <span className="ml-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-primary">
                        You
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-base-content/55">
                    {user.email}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <RoleBadge role={user.role} />
                    <StatusBadge status={user.status} />
                  </div>
                </div>
              </div>
              <UserActionsMenu
                user={user}
                isSelf={user.id === currentUserId}
                onView={onView}
                onEdit={onEdit}
                onChangeStatus={onChangeStatus}
                onDelete={onDelete}
              />
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-base-300/60 pt-3 text-xs">
              <div>
                <dt className="text-base-content/45">Registered</dt>
                <dd className="mt-0.5 text-base-content/70">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-base-content/45">Last active</dt>
                <dd className="mt-0.5 text-base-content/70">
                  {formatDate(user.lastActiveAt)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
