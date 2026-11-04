import { useState } from "react";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Package,
  Plus,
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
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABELS,
  STOCK_FILTERS,
  STOCK_FILTER_LABELS,
} from "@/constants/management";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { ProductFormModal } from "../components/ProductFormModal";
import { ProductsList } from "../components/ProductsList";
import {
  useDeleteProduct,
  useProducts,
  useUpdateProductStatus,
} from "../hooks/useProducts";

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [stock, setStock] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [detailProductId, setDetailProductId] = useState(null);
  const [formState, setFormState] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebouncedValue(search, 250);
  const filters = {
    search: debouncedSearch,
    category,
    status,
    stock,
    sortBy,
    sortOrder,
    page,
    pageSize: MANAGEMENT_PAGE_SIZE,
  };
  const productsQuery = useProducts(filters);
  const statusMutation = useUpdateProductStatus();
  const deleteMutation = useDeleteProduct();
  const products = productsQuery.data?.items ?? [];
  const pagination = productsQuery.data?.pagination;
  const summary = productsQuery.data?.summary;
  const hasFilters = Boolean(
    search.trim() ||
      category !== "all" ||
      status !== "all" ||
      stock !== "all",
  );
  const draftOrInactive =
    (summary?.draft ?? 0) + (summary?.inactive ?? 0);

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
    setCategory("all");
    setStatus("all");
    setStock("all");
    setPage(1);
  };

  const confirmStatusChange = async () => {
    if (!statusTarget) {
      return;
    }

    try {
      await statusMutation.mutateAsync({
        id: statusTarget.product.id,
        status: statusTarget.nextStatus,
      });
      toast.success(
        `${statusTarget.product.name} was ${
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

      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const summaryItems = [
    {
      id: "total",
      label: "Total products",
      value: summary?.total,
      icon: Package,
      tone: "primary",
    },
    {
      id: "active",
      label: "Active products",
      value: summary?.active,
      icon: CheckCircle2,
      tone: "success",
    },
    {
      id: "draft-inactive",
      label: "Draft / inactive",
      value: draftOrInactive,
      icon: Archive,
      tone: "neutral",
    },
    {
      id: "low-stock",
      label: "Low stock",
      value: summary?.lowStock,
      icon: AlertTriangle,
      tone: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog management"
        title="Products"
        description="Manage the product catalog, pricing, inventory levels, and availability."
        actions={
          <Button
            leftIcon={<Plus />}
            onClick={() => setFormState({ mode: "create", product: null })}
          >
            Add product
          </Button>
        }
      />

      {productsQuery.isPending ? (
        <>
          <ManagementSummary isLoading itemCount={4} />
          <Card contentClassName="p-0">
            <TableSkeleton label="Loading products" />
          </Card>
        </>
      ) : productsQuery.isError ? (
        <ErrorState
          title="Unable to load products"
          description={productsQuery.error?.message}
          onRetry={() => productsQuery.refetch()}
        />
      ) : (
        <>
          <ManagementSummary items={summaryItems} />

          <section
            aria-label="Product catalog"
            aria-busy={productsQuery.isFetching}
            className="space-y-4"
          >
            <Card contentClassName="p-4 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.75fr)_minmax(0,0.65fr)_minmax(0,0.75fr)_auto]">
                <SearchInput
                  label="Search products"
                  placeholder="Name or SKU"
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                />
                <Select
                  label="Category"
                  size="sm"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All categories</option>
                  {PRODUCT_CATEGORIES.map((value) => (
                    <option key={value} value={value}>
                      {value}
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
                  {PRODUCT_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {PRODUCT_STATUS_LABELS[value]}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Stock level"
                  size="sm"
                  value={stock}
                  onChange={(event) => {
                    setStock(event.target.value);
                    setPage(1);
                  }}
                >
                  {STOCK_FILTERS.map((value) => (
                    <option key={value} value={value}>
                      {STOCK_FILTER_LABELS[value]}
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

              <div className="mt-3 flex min-h-5 flex-wrap items-center justify-between gap-2 text-xs text-base-content/60">
                <span role="status">
                  {pagination?.totalItems
                    ? `${pagination.totalItems} matching product${
                        pagination.totalItems === 1 ? "" : "s"
                      }`
                    : "No matching products"}
                </span>
                {productsQuery.isFetching ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader size="xs" label="Updating products" />
                    Updating…
                  </span>
                ) : null}
              </div>
            </Card>

            {products.length === 0 ? (
              <EmptyState
                icon={<Package />}
                title={
                  hasFilters
                    ? "No products match these filters"
                    : "No products yet"
                }
                description={
                  hasFilters
                    ? "Try a different search term or clear the category, status, and stock filters."
                    : "Add the first product to begin building the catalog."
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
                        setFormState({ mode: "create", product: null })
                      }
                    >
                      Add product
                    </Button>
                  )
                }
              />
            ) : (
              <Card contentClassName="p-0">
                <ProductsList
                  products={products}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onView={(product) => setDetailProductId(product.id)}
                  onEdit={(product) =>
                    setFormState({ mode: "edit", product })
                  }
                  onChangeStatus={(product, nextStatus) =>
                    setStatusTarget({ product, nextStatus })
                  }
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
                itemLabel="products"
              />
            ) : null}
          </section>
        </>
      )}

      {detailProductId ? (
        <ProductDetailModal
          productId={detailProductId}
          onClose={() => setDetailProductId(null)}
        />
      ) : null}

      {formState ? (
        <ProductFormModal
          mode={formState.mode}
          product={formState.product}
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
          } ${statusTarget.product.name}?`}
          description={
            statusTarget.nextStatus === "active"
              ? "This product will become available for new orders immediately."
              : "This product will no longer be available for new orders. Existing order history is unchanged."
          }
          confirmLabel={
            statusTarget.nextStatus === "active"
              ? "Activate product"
              : "Deactivate product"
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
          description="This permanently removes the product from the catalog. This action cannot be undone."
          confirmLabel="Delete product"
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
