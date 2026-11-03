import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/management/DataTable";
import { StatusBadge } from "@/components/management/StatusBadge";
import { LOW_STOCK_THRESHOLD } from "@/constants/management";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ProductActionsMenu } from "./ProductActionsMenu";
import { ProductThumbnail } from "./ProductThumbnail";

function isLowStock(stock) {
  return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
}

function StockCell({ stock }) {
  if (stock === 0) {
    return <StatusBadge status="out_of_stock" />;
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={
          isLowStock(stock)
            ? "font-semibold tabular-nums text-warning"
            : "tabular-nums text-base-content"
        }
      >
        {stock}
      </span>
      {isLowStock(stock) ? (
        <StatusBadge status="low_stock" label="Low stock" />
      ) : null}
    </div>
  );
}

export function ProductsList({
  products,
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
      id: "product",
      header: "Product",
      cell: (product) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <ProductThumbnail
            src={product.imageUrl}
            name={product.name}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-base-content">
              {product.name}
            </p>
            {isLowStock(product.stock) ? (
              <p className="mt-0.5 inline-flex items-center gap-1 text-[0.6875rem] font-medium text-warning">
                <AlertTriangle className="size-3" aria-hidden="true" />
                Running low
              </p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      id: "sku",
      header: "SKU",
      className: "whitespace-nowrap font-mono text-xs text-base-content/60",
      cell: (product) => product.sku,
    },
    {
      id: "category",
      header: "Category",
      className: "whitespace-nowrap text-base-content/65",
      cell: (product) => product.category,
    },
    {
      id: "price",
      header: "Price",
      sortKey: "price",
      headerClassName: "text-right",
      className: "whitespace-nowrap text-right font-medium tabular-nums",
      cell: (product) => formatCurrency(product.price, { precise: true }),
    },
    {
      id: "stock",
      header: "Stock",
      sortKey: "stock",
      headerClassName: "text-right",
      className: "whitespace-nowrap text-right",
      cell: (product) => (
        <div className="flex justify-end">
          <StockCell stock={product.stock} />
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (product) => <StatusBadge status={product.status} />,
    },
    {
      id: "createdAt",
      header: "Created",
      sortKey: "createdAt",
      className: "whitespace-nowrap text-base-content/60",
      cell: (product) => formatDate(product.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (product) => (
        <ProductActionsMenu
          product={product}
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
          caption="Products"
          columns={columns}
          rows={products}
          getRowKey={(product) => product.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          minWidthClassName="min-w-[980px]"
        />
      </div>

      <ul className="divide-y divide-base-300/70 lg:hidden">
        {products.map((product) => (
          <li key={product.id} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <ProductThumbnail
                  src={product.imageUrl}
                  name={product.name}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-base-content">
                    {product.name}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-base-content/50">
                    {product.sku}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="neutral">{product.category}</Badge>
                    <StatusBadge status={product.status} />
                  </div>
                </div>
              </div>
              <ProductActionsMenu
                product={product}
                onView={onView}
                onEdit={onEdit}
                onChangeStatus={onChangeStatus}
                onDelete={onDelete}
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-base-300/60 pt-3 text-xs">
              <div>
                <p className="text-base-content/45">Price</p>
                <p className="mt-0.5 font-semibold tabular-nums text-base-content">
                  {formatCurrency(product.price, { precise: true })}
                </p>
              </div>
              <div>
                <p className="text-base-content/45">Stock</p>
                <div className="mt-0.5">
                  <StockCell stock={product.stock} />
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-base-content/45">Created</p>
                <p className="mt-0.5 text-base-content/70">
                  {formatDate(product.createdAt)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
