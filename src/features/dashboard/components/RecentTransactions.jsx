import { ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatCurrency, formatDate } from "@/utils/formatters";

const STATUS_CONFIG = Object.freeze({
  completed: { label: "Completed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
  refunded: { label: "Refunded", variant: "info" },
});

function getStatusConfig(status) {
  return STATUS_CONFIG[status] ?? { label: status, variant: "neutral" };
}

function TransactionsSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Loading recent transactions"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton variant="text" className="h-4 w-24" />
          <Skeleton variant="text" className="h-4 flex-1" />
          <Skeleton variant="text" className="h-4 w-20" />
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
      ))}
      <span className="sr-only">Loading recent transactions</span>
    </div>
  );
}

export function RecentTransactions({
  items = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}) {
  const hasItems = items.length > 0;

  return (
    <Card
      header={
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-heading-3 font-semibold text-base-content">
              Recent transactions
            </h3>
            <p className="mt-1 text-sm text-base-content/60">
              Latest payments recorded in the selected period.
            </p>
          </div>
          {!isLoading && !isError && hasItems ? (
            <Badge variant="neutral" size="sm">
              {items.length} latest
            </Badge>
          ) : null}
        </div>
      }
    >
      {isLoading ? (
        <TransactionsSkeleton />
      ) : isError ? (
        <ErrorState
          title="Unable to load recent transactions"
          description={errorMessage}
          onRetry={onRetry}
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : !hasItems ? (
        <EmptyState
          icon={<ReceiptText />}
          title="No transactions in this range"
          description="Try expanding the date range to see more payment activity."
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : (
        <>
          <ul className="divide-y divide-base-300/70 lg:hidden">
            {items.map((transaction) => {
              const status = getStatusConfig(transaction.status);

              return (
                <li key={transaction.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-base-content/60">
                        {transaction.id}
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-base-content">
                        {transaction.customer}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-base-content/60">
                        {formatDate(transaction.date)} · {transaction.method}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <p className="text-sm font-semibold tabular-nums text-base-content">
                        {formatCurrency(transaction.amount, { precise: true })}
                      </p>
                      <Badge variant={status.variant} size="sm">
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Recent transactions for the selected period
              </caption>
              <thead>
                <tr className="text-xs uppercase tracking-wide text-base-content/60">
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    Transaction
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    Customer
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    Date
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    Method
                  </th>
                  <th
                    scope="col"
                    className="pb-3 pr-4 text-right font-semibold"
                  >
                    Amount
                  </th>
                  <th scope="col" className="pb-3 text-right font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((transaction) => {
                  const status = getStatusConfig(transaction.status);

                  return (
                    <tr
                      key={transaction.id}
                      className="border-t border-base-300/70"
                    >
                      <td className="py-3 pr-4 font-mono text-xs text-base-content/60">
                        {transaction.id}
                      </td>
                      <td className="py-3 pr-4 font-medium text-base-content">
                        {transaction.customer}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-base-content/60">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-base-content/60">
                        {transaction.method}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-right font-semibold tabular-nums text-base-content">
                        {formatCurrency(transaction.amount, { precise: true })}
                      </td>
                      <td className="py-3 text-right">
                        <Badge variant={status.variant} size="sm">
                          {status.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}
