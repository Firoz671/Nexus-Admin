import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
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
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
} from "@/constants/management";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { OrderDetailModal } from "../components/OrderDetailModal";
import { OrdersList } from "../components/OrdersList";
import {
  useOrders,
  useUpdateOrderStatus,
} from "../hooks/useOrders";

function getStatusConfirmation(order, nextStatus) {
  if (nextStatus === "cancelled") {
    return {
      title: `Cancel ${order.id}?`,
      description:
        "This marks the order as cancelled. The action cannot be undone and the order cannot be fulfilled.",
      confirmLabel: "Cancel order",
      variant: "danger",
    };
  }

  if (nextStatus === "processing") {
    return {
      title: `Start processing ${order.id}?`,
      description:
        "The order will enter the fulfillment queue and its status will change to processing.",
      confirmLabel: "Start processing",
      variant: "primary",
    };
  }

  if (nextStatus === "shipped") {
    return {
      title: `Mark ${order.id} as shipped?`,
      description:
        "The customer will see this order as shipped. Tracking details are managed outside this workspace.",
      confirmLabel: "Mark as shipped",
      variant: "primary",
    };
  }

  return {
    title: `Mark ${order.id} as delivered?`,
    description:
      "This completes the fulfillment workflow. Delivered orders become read-only and cannot be changed.",
    confirmLabel: "Mark as delivered",
    variant: "primary",
  };
}

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [detailOrderId, setDetailOrderId] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const debouncedSearch = useDebouncedValue(search, 250);
  const dateRangeError =
    dateFrom && dateTo && dateFrom > dateTo
      ? "Start date must be on or before the end date."
      : "";
  const filters = {
    search: debouncedSearch,
    status,
    paymentStatus,
    dateFrom: dateRangeError ? "" : dateFrom,
    dateTo: dateRangeError ? "" : dateTo,
    sortBy,
    sortOrder,
    page,
    pageSize: MANAGEMENT_PAGE_SIZE,
  };
  const ordersQuery = useOrders(filters);
  const statusMutation = useUpdateOrderStatus();
  const orders = ordersQuery.data?.items ?? [];
  const pagination = ordersQuery.data?.pagination;
  const summary = ordersQuery.data?.summary;
  const hasFilters = Boolean(
    search.trim() ||
      status !== "all" ||
      paymentStatus !== "all" ||
      dateFrom ||
      dateTo,
  );
  const inProgress =
    (summary?.processing ?? 0) + (summary?.shipped ?? 0);

  const handleSort = (nextSortBy) => {
    if (nextSortBy === sortBy) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(nextSortBy);
      setSortOrder("desc");
    }

    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPaymentStatus("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const requestStatusChange = (order, nextStatus) => {
    setDetailOrderId(null);
    setStatusTarget({ order, nextStatus });
  };

  const confirmStatusChange = async () => {
    if (!statusTarget) {
      return;
    }

    try {
      await statusMutation.mutateAsync({
        id: statusTarget.order.id,
        status: statusTarget.nextStatus,
      });
      toast.success(
        statusTarget.nextStatus === "cancelled"
          ? `${statusTarget.order.id} was cancelled.`
          : `${statusTarget.order.id} was marked as ${ORDER_STATUS_LABELS[
              statusTarget.nextStatus
            ].toLowerCase()}.`,
      );
      setStatusTarget(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const summaryItems = [
    {
      id: "total",
      label: "Total orders",
      value: summary?.total,
      icon: ShoppingCart,
      tone: "primary",
    },
    {
      id: "pending",
      label: "Pending",
      value: summary?.pending,
      icon: Clock,
      tone: "warning",
    },
    {
      id: "in-progress",
      label: "In progress",
      value: inProgress,
      icon: Truck,
      tone: "neutral",
    },
    {
      id: "completed",
      label: "Completed",
      value: summary?.completed,
      icon: CheckCircle2,
      tone: "success",
    },
    {
      id: "cancelled",
      label: "Cancelled",
      value: summary?.cancelled,
      icon: XCircle,
      tone: "danger",
    },
  ];
  const confirmation = statusTarget
    ? getStatusConfirmation(statusTarget.order, statusTarget.nextStatus)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fulfillment"
        title="Orders"
        description="Review customer orders and move them through the fulfillment workflow. Payment and order statuses are managed independently."
      />

      {ordersQuery.isPending ? (
        <>
          <ManagementSummary
            isLoading
            itemCount={5}
            gridClassName="sm:grid-cols-2 xl:grid-cols-5"
          />
          <Card contentClassName="p-0">
            <TableSkeleton label="Loading orders" />
          </Card>
        </>
      ) : ordersQuery.isError ? (
        <ErrorState
          title="Unable to load orders"
          description={ordersQuery.error?.message}
          onRetry={() => ordersQuery.refetch()}
        />
      ) : (
        <>
          <ManagementSummary
            items={summaryItems}
            gridClassName="sm:grid-cols-2 xl:grid-cols-5"
          />

          <section
            aria-label="Order directory"
            aria-busy={ordersQuery.isFetching}
            className="space-y-4"
          >
            <Card contentClassName="p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                <SearchInput
                  label="Search orders"
                  placeholder="Order, customer, or email"
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                />
                <Select
                  label="Order status"
                  size="sm"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All statuses</option>
                  {ORDER_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {ORDER_STATUS_LABELS[value]}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Payment"
                  size="sm"
                  value={paymentStatus}
                  onChange={(event) => {
                    setPaymentStatus(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All payments</option>
                  {PAYMENT_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {PAYMENT_STATUS_LABELS[value]}
                    </option>
                  ))}
                </Select>
                <Input
                  label="From"
                  type="date"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(event) => {
                    setDateFrom(event.target.value);
                    setPage(1);
                  }}
                />
                <Input
                  label="To"
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(event) => {
                    setDateTo(event.target.value);
                    setPage(1);
                  }}
                />
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

              {dateRangeError ? (
                <p role="alert" className="mt-2 text-sm text-error">
                  {dateRangeError}
                </p>
              ) : null}

              <div className="mt-3 flex min-h-5 flex-wrap items-center justify-between gap-2 text-xs text-base-content/50">
                <span>
                  {pagination?.totalItems
                    ? `${pagination.totalItems} matching order${
                        pagination.totalItems === 1 ? "" : "s"
                      }`
                    : "No matching orders"}
                </span>
                {ordersQuery.isFetching ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader size="xs" label="Updating orders" />
                    Updating…
                  </span>
                ) : null}
              </div>
            </Card>

            {orders.length === 0 ? (
              <EmptyState
                icon={<ShoppingCart />}
                title={
                  hasFilters
                    ? "No orders match these filters"
                    : "No orders yet"
                }
                description={
                  hasFilters
                    ? "Try a different search term or clear the status, payment, and date filters."
                    : "New customer orders will appear here as soon as they are placed."
                }
                action={
                  hasFilters ? (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  ) : null
                }
              />
            ) : (
              <Card contentClassName="p-0">
                <OrdersList
                  orders={orders}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onView={(order) => setDetailOrderId(order.id)}
                  onChangeStatus={requestStatusChange}
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
                itemLabel="orders"
              />
            ) : null}
          </section>
        </>
      )}

      {detailOrderId ? (
        <OrderDetailModal
          orderId={detailOrderId}
          onClose={() => setDetailOrderId(null)}
          onChangeStatus={requestStatusChange}
        />
      ) : null}

      {statusTarget && confirmation ? (
        <ConfirmDialog
          title={confirmation.title}
          description={confirmation.description}
          confirmLabel={confirmation.confirmLabel}
          variant={confirmation.variant}
          isLoading={statusMutation.isPending}
          onConfirm={confirmStatusChange}
          onClose={() => {
            if (!statusMutation.isPending) {
              setStatusTarget(null);
            }
          }}
        />
      ) : null}
    </div>
  );
}
