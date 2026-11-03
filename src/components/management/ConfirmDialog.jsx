import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/utils/cn";

export function ConfirmDialog({
  open = true,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
  onConfirm,
  onClose,
}) {
  const isDanger = variant === "danger";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnBackdrop={!isLoading}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? "danger" : "primary"}
            loading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            isDanger
              ? "bg-error/10 text-error"
              : "bg-warning/10 text-warning",
          )}
        >
          <AlertTriangle className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm leading-6 text-base-content/70">{description}</p>
      </div>
    </Modal>
  );
}
