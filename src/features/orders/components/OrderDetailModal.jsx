import { CreditCard, MapPin, Package, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/management/StatusBadge";
import { ErrorState } from "@/components/shared/ErrorState";
import { getOrderStatusActions } from "@/constants/management";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { useOrder } from "../hooks/useOrders";

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading order details" className="space-y-6">
      <div className="space-y-2">
        <Skeleton variant="text" className="h-5 w-36" />
        <Skeleton variant="text" className="h-3 w-56" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} variant="text" className="h-14 w-full" />
        ))}
      </div>
      <Skeleton variant="rect" className="h-48 w-full" />
      <span className="sr-only">Loading order details</span>
    </div>
  );
}

function SectionHeading({ icon, children }) {
  return (
    <h4 className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-base-content/60">
      {icon}
      {children}
    </h4>
  );
}

export function OrderDetailModal({ orderId, onClose, onChangeStatus }) {
  const orderQuery = useOrder(orderId);
  const order = orderQuery.data;
  const statusActions = order ? getOrderStatusActions(order.status) : [];
  const itemCount = order
    ? order.items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <Modal
      open
      onClose={onClose}
      title="Order details"
      size="lg"
      className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      footer={
        <>
          {statusActions.map((action) => (
            <Button
              key={action.status}
              variant={action.status === "cancelled" ? "danger" : "outline"}
              size="sm"
              onClick={() => onChangeStatus(order, action.status)}
            >
              {action.label}
            </Button>
          ))}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      {orderQuery.isPending ? (
        <DetailSkeleton />
      ) : orderQuery.isError ? (
        <ErrorState
          title="Unable to load this order"
          description={orderQuery.error?.message}
          onRetry={() => orderQuery.refetch()}
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-mono text-lg font-semibold text-base-content">
                  {order.id}
                </h3>
                <StatusBadge status={order.status} />
                <StatusBadge status={order.paymentStatus} />
              </div>
              <p className="mt-1 text-sm text-base-content/60">
                Placed {formatDateTime(order.date)}
              </p>
            </div>
            <Badge variant="neutral">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </Badge>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <section>
              <SectionHeading icon={<UserRound className="size-3.5" />}>
                Customer
              </SectionHeading>
              <div className="mt-2 space-y-0.5 text-sm">
                <p className="font-medium text-base-content">
                  {order.customer.name}
                </p>
                <p className="break-all text-base-content/60">
                  {order.customer.email}
                </p>
                <p className="text-base-content/60">{order.customer.phone}</p>
              </div>
            </section>

            <section>
              <SectionHeading icon={<MapPin className="size-3.5" />}>
                Shipping address
              </SectionHeading>
              <address className="mt-2 space-y-0.5 text-sm not-italic text-base-content/60">
                <p className="font-medium text-base-content">
                  {order.shipping.name}
                </p>
                <p>{order.shipping.line1}</p>
                <p>
                  {order.shipping.city}, {order.shipping.state}{" "}
                  {order.shipping.postalCode}
                </p>
                <p>{order.shipping.country}</p>
              </address>
            </section>
          </div>

          <section aria-label="Order items">
            <SectionHeading icon={<Package className="size-3.5" />}>
              Items
            </SectionHeading>
            <div className="mt-2 overflow-hidden rounded-card border border-base-300">
              <ul className="divide-y divide-base-300/70">
                {order.items.map((item) => (
                  <li
                    key={`${item.productId}-${item.sku}`}
                    className="flex items-start justify-between gap-4 p-3.5"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-base-content">
                        {item.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[0.6875rem] text-base-content/60">
                        {item.sku}
                      </p>
                      <p className="mt-1 text-xs text-base-content/60">
                        {item.quantity} × {formatCurrency(item.unitPrice, {
                          precise: true,
                        })}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold tabular-nums text-base-content">
                      {formatCurrency(item.lineTotal, { precise: true })}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2 border-t border-base-300 bg-base-200/40 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-base-content/60">Subtotal</dt>
                  <dd className="tabular-nums text-base-content">
                    {formatCurrency(order.subtotal, { precise: true })}
                  </dd>
                </div>
                {order.discount > 0 ? (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-base-content/60">Discount</dt>
                    <dd className="tabular-nums text-success">
                      −{formatCurrency(order.discount, { precise: true })}
                    </dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3 border-t border-base-300 pt-2">
                  <dt className="font-semibold text-base-content">Total</dt>
                  <dd className="text-base font-semibold tabular-nums text-base-content">
                    {formatCurrency(order.total, { precise: true })}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section>
            <SectionHeading icon={<CreditCard className="size-3.5" />}>
              Payment
            </SectionHeading>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-base-content/60">
              <span>{order.paymentMethod}</span>
              <span aria-hidden="true">·</span>
              <StatusBadge status={order.paymentStatus} />
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
}
