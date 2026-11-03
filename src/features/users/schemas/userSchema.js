import { z } from "zod";
import { MANAGEMENT_ROLES, USER_STATUSES } from "@/constants/management";

const nameField = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters.")
  .max(80, "Full name must be 80 characters or fewer.");

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(120, "Email must be 120 characters or fewer.")
  .pipe(z.email("Enter a valid email address."))
  .transform((value) => value.toLowerCase());

const optionalText = (maxLength, message) =>
  z
    .string()
    .trim()
    .max(maxLength, message)
    .optional()
    .transform((value) => value || null);

const roleField = z.enum(MANAGEMENT_ROLES, {
  error: "Choose a valid role.",
});

const statusField = z.enum(USER_STATUSES, {
  error: "Choose a valid user status.",
});

export const userFormSchema = z.object({
  name: nameField,
  email: emailField,
  role: roleField,
  status: statusField,
  phone: optionalText(30, "Phone number must be 30 characters or fewer."),
  department: optionalText(60, "Department must be 60 characters or fewer."),
});

export const selfUserFormSchema = z.object({
  name: nameField,
  phone: optionalText(30, "Phone number must be 30 characters or fewer."),
  department: optionalText(60, "Department must be 60 characters or fewer."),
});
