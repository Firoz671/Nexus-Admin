import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ROLE_LABELS, ROLES } from "@/constants/permissions";
import {
  MANAGEMENT_ROLES,
  USER_STATUSES,
  USER_STATUS_LABELS,
} from "@/constants/management";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import {
  selfUserFormSchema,
  userFormSchema,
} from "../schemas/userSchema";
import { useCreateUser, useUpdateUser } from "../hooks/useUsers";

function getDefaultValues(user) {
  return {
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? ROLES.MANAGER,
    status: user?.status ?? "active",
    phone: user?.phone ?? "",
    department: user?.department ?? "",
  };
}

export function UserFormModal({
  mode = "create",
  user = null,
  isSelf = false,
  onClose,
  onSaved,
}) {
  const isEdit = mode === "edit";
  const formId = useId();
  const [serverError, setServerError] = useState("");
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isSelf ? selfUserFormSchema : userFormSchema),
    defaultValues: getDefaultValues(user),
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

    const payload = {
      name: values.name,
      phone: values.phone ?? null,
      department: values.department ?? null,
    };

    if (!isSelf) {
      payload.email = values.email;
      payload.role = values.role;
      payload.status = values.status;
    }

    try {
      const saved = isEdit
        ? await updateMutation.mutateAsync({ id: user.id, values: payload })
        : await createMutation.mutateAsync(payload);

      toast.success(
        isEdit ? "User updated successfully." : "User created successfully.",
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
      title={isEdit ? "Edit user" : "Create user"}
      description={
        isEdit
          ? "Update profile details, role, and account status."
          : "Add a workspace member and assign their access level."
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
            {isEdit ? "Save changes" : "Create user"}
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
          label="Full name"
          required
          autoFocus
          placeholder="e.g. Taylor Reed"
          error={errors.name?.message}
          {...register("name")}
        />

        {isSelf ? (
          <div className="rounded-control border border-base-300 bg-base-200/60 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
              Protected account fields
            </p>
            <p className="mt-1.5 text-xs leading-5 text-base-content/60">
              Email, role, and status cannot be changed for the account that is
              currently signed in.
            </p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-base-content/60">Email</dt>
                <dd className="mt-0.5 font-medium text-base-content">
                  {user?.email}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-base-content/60">Role</dt>
                <dd className="mt-0.5 font-medium text-base-content">
                  {ROLE_LABELS[user?.role] ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-base-content/60">Status</dt>
                <dd className="mt-0.5 font-medium text-base-content">
                  {USER_STATUS_LABELS[user?.status] ?? "—"}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              required
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Select
              label="Role"
              required
              error={errors.role?.message}
              {...register("role")}
            >
              {MANAGEMENT_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </Select>
            <Select
              label="Status"
              required
              error={errors.status?.message}
              {...register("status")}
            >
              {USER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {USER_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Department"
            placeholder="e.g. Operations"
            error={errors.department?.message}
            {...register("department")}
          />
        </div>
      </form>
    </Modal>
  );
}
