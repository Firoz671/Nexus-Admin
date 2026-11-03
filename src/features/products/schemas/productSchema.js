import { z } from "zod";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
} from "@/constants/management";

const requiredNumber = (message) =>
  z.preprocess(
    (value) => (value === "" || value == null ? Number.NaN : value),
    z.coerce.number({ error: message }),
  );

const optionalText = (maxLength, message) =>
  z
    .string()
    .trim()
    .max(maxLength, message)
    .optional()
    .transform((value) => value || null);

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters.")
    .max(120, "Product name must be 120 characters or fewer."),
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required.")
    .max(40, "SKU must be 40 characters or fewer.")
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9_-]*$/,
      "Use letters, numbers, hyphens, or underscores.",
    )
    .transform((value) => value.toUpperCase()),
  category: z.enum(PRODUCT_CATEGORIES, {
    error: "Choose a valid category.",
  }),
  price: requiredNumber("Enter a valid price.").pipe(
    z
      .number()
      .positive("Price must be greater than zero.")
      .max(1000000, "Price must be 1,000,000 or less."),
  ),
  stock: requiredNumber("Enter a valid stock quantity.").pipe(
    z
      .number()
      .int("Stock must be a whole number.")
      .min(0, "Stock cannot be negative.")
      .max(1000000, "Stock must be 1,000,000 or less."),
  ),
  status: z.enum(PRODUCT_STATUSES, {
    error: "Choose a valid product status.",
  }),
  description: optionalText(
    500,
    "Description must be 500 characters or fewer.",
  ),
  imageUrl: z
    .string()
    .trim()
    .max(500, "Image URL must be 500 characters or fewer.")
    .optional()
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      "Enter a valid image URL starting with http:// or https://.",
    )
    .transform((value) => value || null),
});
