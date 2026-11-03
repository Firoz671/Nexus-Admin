import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PRODUCT_STATUS_LABELS,
} from "@/constants/management";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { productFormSchema } from "../schemas/productSchema";
import {
  useCreateProduct,
  useUpdateProduct,
} from "../hooks/useProducts";

function getDefaultValues(product) {
  return {
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    category: product?.category ?? PRODUCT_CATEGORIES[0],
    price: product?.price ?? "",
    stock: product?.stock ?? "",
    status: product?.status ?? "active",
    description: product?.description ?? "",
    imageUrl: product?.imageUrl ?? "",
  };
}

export function ProductFormModal({
  mode = "create",
  product = null,
  onClose,
  onSaved,
}) {
  const isEdit = mode === "edit";
  const formId = useId();
  const [serverError, setServerError] = useState("");
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: getDefaultValues(product),
    mode: "onTouched",
  });
  const isPending = createMutation.isPending || updateMutation.isPending;
  const isBusy = isSubmitting || isPending;

  const closeIfIdle = () => {
    if (!isBusy) {
      onClose();
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");

    try {
      const saved = isEdit
        ? await updateMutation.mutateAsync({
            id: product.id,
            values,
          })
        : await createMutation.mutateAsync(values);

      toast.success(
        isEdit
          ? "Product updated successfully."
          : "Product created successfully.",
      );
      onSaved?.(saved);
      onClose();
    } catch (error) {
      setServerError(error.message);
    }
  });

  return (
    <Modal
      open
      onClose={closeIfIdle}
      title={isEdit ? "Edit product" : "Create product"}
      description={
        isEdit
          ? "Update catalog details, pricing, inventory, and availability."
          : "Add a product to the catalog with pricing and inventory details."
      }
      size="md"
      className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      showCloseButton={!isBusy}
      closeOnBackdrop={!isBusy}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={closeIfIdle}
            disabled={isBusy}
          >
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={isBusy}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </>
      }
    >
      <form id={formId} noValidate onSubmit={onSubmit} className="space-y-4">
        {serverError ? (
          <div
            role="alert"
            className="rounded-control border border-error/30 bg-error/10 px-3 py-2.5 text-sm text-error"
          >
            {serverError}
          </div>
        ) : null}

        <Input
          label="Product name"
          required
          autoFocus
          placeholder="e.g. Analytics Suite"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="SKU"
            required
            placeholder="e.g. NX-ANL-001"
            error={errors.sku?.message}
            {...register("sku")}
          />
          <Select
            label="Category"
            required
            error={errors.category?.message}
            {...register("category")}
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price (USD)"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
            error={errors.price?.message}
            {...register("price")}
          />
          <Input
            label="Stock quantity"
            type="number"
            step="1"
            min="0"
            required
            placeholder="0"
            error={errors.stock?.message}
            {...register("stock")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Status"
            required
            error={errors.status?.message}
            {...register("status")}
          >
            {PRODUCT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {PRODUCT_STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
          <Input
            label="Image URL"
            type="url"
            placeholder="https://example.com/product.png"
            error={errors.imageUrl?.message}
            {...register("imageUrl")}
          />
        </div>

        <Textarea
          label="Description"
          rows={3}
          placeholder="Short product description…"
          error={errors.description?.message}
          {...register("description")}
        />
      </form>
    </Modal>
  );
}
