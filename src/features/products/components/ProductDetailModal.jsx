import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { DetailGrid } from "@/components/management/DetailGrid";
import { StatusBadge } from "@/components/management/StatusBadge";
import { ErrorState } from "@/components/shared/ErrorState";
import { LOW_STOCK_THRESHOLD } from "@/constants/management";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useProduct } from "../hooks/useProducts";
import { ProductThumbnail } from "./ProductThumbnail";

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading product details" className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton variant="rect" className="size-16" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-44" />
          <Skeleton variant="text" className="h-3 w-32" />
          <Skeleton variant="text" className="h-5 w-20" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} variant="text" className="h-10 w-full" />
        ))}
      </div>
      <span className="sr-only">Loading product details</span>
    </div>
  );
}

function getStockStatus(stock) {
  if (stock === 0) {
    return "out_of_stock";
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return "low_stock";
  }

  return "in_stock";
}

export function ProductDetailModal({ productId, onClose }) {
  const productQuery = useProduct(productId);
  const product = productQuery.data;

  return (
    <Modal
      open
      onClose={onClose}
      title="Product details"
      size="lg"
      className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      {productQuery.isPending ? (
        <DetailSkeleton />
      ) : productQuery.isError ? (
        <ErrorState
          title="Unable to load this product"
          description={productQuery.error?.message}
          onRetry={() => productQuery.refetch()}
          className="border-0 bg-transparent px-0 py-8"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ProductThumbnail
              src={product.imageUrl}
              name={product.name}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-heading-3 font-semibold text-base-content">
                {product.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-base-content/55">
                {product.sku}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge variant="neutral">{product.category}</Badge>
                <StatusBadge status={product.status} />
                <StatusBadge status={getStockStatus(product.stock)} />
              </div>
            </div>
          </div>

          <DetailGrid
            items={[
              {
                label: "Price",
                value: formatCurrency(product.price, { precise: true }),
              },
              {
                label: "Stock quantity",
                value: `${product.stock} unit${
                  product.stock === 1 ? "" : "s"
                }`,
              },
              { label: "Category", value: product.category },
              {
                label: "Product status",
                value: product.status,
              },
              { label: "Created", value: formatDate(product.createdAt) },
              {
                label: "Product ID",
                value: <span className="font-mono text-xs">{product.id}</span>,
              },
            ]}
          />

          <div>
            <h4 className="text-[0.6875rem] font-semibold uppercase tracking-wide text-base-content/45">
              Description
            </h4>
            <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-base-content/70">
              {product.description || "No description provided."}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
