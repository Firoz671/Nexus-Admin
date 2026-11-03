import { Mail, Phone, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { DetailGrid } from "@/components/management/DetailGrid";
import { StatusBadge } from "@/components/management/StatusBadge";
import { ErrorState } from "@/components/shared/ErrorState";
import { ROLE_LABELS, ROLES } from "@/constants/permissions";
import { formatDate, formatDateTime } from "@/utils/formatters";
import { useUser } from "../hooks/useUsers";

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading user details" className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="size-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-40" />
          <Skeleton variant="text" className="h-3 w-56" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} variant="text" className="h-10 w-full" />
        ))}
      </div>
      <span className="sr-only">Loading user details</span>
    </div>
  );
}

export function UserDetailModal({ userId, onClose }) {
  const userQuery = useUser(userId);
  const user = userQuery.data;

  return (
    <Modal
      open
      onClose={onClose}
      title="User details"
      size="lg"
      className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      {userQuery.isPending ? (
        <DetailSkeleton />
      ) : userQuery.isError ? (
        <ErrorState
          title="Unable to load this user"
          description={userQuery.error?.message}
          onRetry={() => userQuery.refetch()}
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={user.name} src={user.avatar} size="xl" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-heading-3 font-semibold text-base-content">
                  {user.name}
                </h3>
                <StatusBadge status={user.status} />
              </div>
              <p className="mt-1 flex items-center gap-1.5 break-all text-sm text-base-content/60">
                <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                {user.email}
              </p>
            </div>
            <Badge variant={user.role === ROLES.ADMIN ? "info" : "neutral"}>
              <ShieldCheck className="size-3" aria-hidden="true" />
              {ROLE_LABELS[user.role] ?? user.role}
            </Badge>
          </div>

          <DetailGrid
            items={[
              {
                label: "User ID",
                value: <span className="font-mono text-xs">{user.id}</span>,
              },
              { label: "Department", value: user.department },
              {
                label: "Phone",
                value: user.phone ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5" aria-hidden="true" />
                    {user.phone}
                  </span>
                ) : null,
              },
              { label: "Role", value: ROLE_LABELS[user.role] ?? user.role },
              {
                label: "Registered",
                value: formatDate(user.createdAt),
              },
              {
                label: "Last active",
                value: user.lastActiveAt
                  ? formatDateTime(user.lastActiveAt)
                  : "Never",
              },
            ]}
          />
        </div>
      )}
    </Modal>
  );
}
