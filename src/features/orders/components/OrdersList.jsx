import { Avatar } from "@/components/ui/Avatar";
import { DataTable } from "@/components/management/DataTable";
import { StatusBadge } from "@/components/management/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { OrderActionsMenu } from "./OrderActionsMenu";

function getOrderItemCount(order) {
  return order.items.reduce((total, item) => total + item.quantity, 0);
}

function getLineCount(order) {
  return order.items.length;
}

function ItemCount({ order }) {
  const itemCount = getOrderItemCount(order);
  const lineCount = getLineCount(order);

  return (
    <div>
      <p className="whitespace-nowrap font-medium text-base-content">
        {itemCount} item{itemCount === 1 ? "" : "s"}
      </p>
      <p className="mt-0.5 whitespace-nowrap text-xs text-base-content/60">
        {lineCount} line{lineCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export function OrdersList({
  orders,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onChangeStatus,
}) {
  const columns = [
    {
      id: "order",
      header: "Order",
      className: "whitespace-nowrap",
      cell: (order) => (
        <span className="font-mono text-xs font-semibold text-base-content">
          {order.id}
        </span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: (order) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={order.customer.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-base-content">
              {order.customer.name}
            </p>
            <p className="mt-0.5 max-w-48 truncate text-xs text-base-content/60">
              {order.customer.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "date",
      header: "Date",
      sortKey: "date",
      className: "whitespace-nowrap text-base-content/60",
      cell: (order) => formatDate(order.date),
    },
    {
      id: "items",
      header: "Items",
      cell: (order) => <ItemCount order={order} />,
    },
    {
      id: "total",
      header: "Total",
      sortKey: "total",
      headerClassName: "text-right",
      className: "whitespace-nowrap text-right font-semibold tabular-nums",
      cell: (order) => formatCurrency(order.total, { precise: true }),
    },
    {
      id: "status",
      header: "Status",
      cell: (order) => <StatusBadge status={order.status} />,
    },
    {
      id: "paymentStatus",
      header: "Payment",
      cell: (order) => <StatusBadge status={order.paymentStatus} />,
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (order) => (
        <OrderActionsMenu
          order={order}
          onView={onView}
          onChangeStatus={onChangeStatus}
        />
      ),
    },
  ];

  return (
    <>
      <div className="hidden p-4 sm:p-5 lg:block">
        <DataTable
          caption="Orders"
          columns={columns}
          rows={orders}
          getRowKey={(order) => order.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          minWidthClassName="min-w-[980px]"
        />
      </div>

      <ul className="divide-y divide-base-300/70 lg:hidden">
        {orders.map((order) => (
          <li key={order.id} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs font-semibold text-base-content">
                  {order.id}
                </p>
                <p className="mt-1 text-xs text-base-content/60">
                  {formatDate(order.date)}
                </p>
              </div>
              <OrderActionsMenu
                order={order}
                onView={onView}
                onChangeStatus={onChangeStatus}
              />
            </div>

            <div className="mt-3 flex items-start gap-3">
              <Avatar name={order.customer.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-base-content">
                  {order.customer.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-base-content/60">
                  {order.customer.email}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={order.status} />
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-end justify-between gap-3 border-t border-base-300/60 pt-3">
              <ItemCount order={order} />
              <p className="font-semibold tabular-nums text-base-content">
                {formatCurrency(order.total, { precise: true })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
