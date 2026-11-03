import { describe, expect, it } from "vitest";
import {
  selfUserFormSchema,
  userFormSchema,
} from "@/features/users/schemas/userSchema";
import { productFormSchema } from "@/features/products/schemas/productSchema";

function errorMessages(result) {
  return result.error.issues.map((issue) => issue.message);
}

describe("management form schemas", () => {
  describe("user form schema", () => {
    it("normalizes valid user input", () => {
      const result = userFormSchema.safeParse({
        name: "  Taylor Reed  ",
        email: "Taylor.Reed@Nexus.Test",
        role: "manager",
        status: "active",
        phone: "",
        department: " Operations ",
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        name: "Taylor Reed",
        email: "taylor.reed@nexus.test",
        role: "manager",
        status: "active",
        phone: null,
        department: "Operations",
      });
    });

    it("rejects invalid user input", () => {
      const result = userFormSchema.safeParse({
        name: "A",
        email: "not-an-email",
        role: "owner",
        status: "suspended",
      });

      expect(result.success).toBe(false);
      expect(errorMessages(result)).toEqual(
        expect.arrayContaining([
          "Full name must be at least 2 characters.",
          "Enter a valid email address.",
          "Choose a valid role.",
          "Choose a valid user status.",
        ]),
      );
    });

    it("only keeps editable fields for self profile updates", () => {
      const result = selfUserFormSchema.safeParse({
        name: "Alex Morgan",
        email: "hacker@nexus.test",
        role: "admin",
        status: "inactive",
        phone: "+1 (415) 555-0100",
        department: "Administration",
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        name: "Alex Morgan",
        phone: "+1 (415) 555-0100",
        department: "Administration",
      });
    });
  });

  describe("product form schema", () => {
    it("coerces numeric fields and normalizes optional values", () => {
      const result = productFormSchema.safeParse({
        name: "Test Product",
        sku: "nx-test-001",
        category: "Analytics",
        price: "49.99",
        stock: "8",
        status: "draft",
        description: "A test product.",
        imageUrl: "https://example.com/product.png",
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        name: "Test Product",
        sku: "NX-TEST-001",
        category: "Analytics",
        price: 49.99,
        stock: 8,
        status: "draft",
        description: "A test product.",
        imageUrl: "https://example.com/product.png",
      });

      const withEmptyOptionals = productFormSchema.safeParse({
        name: "Test Product",
        sku: "NX-TEST-001",
        category: "Analytics",
        price: "10",
        stock: "0",
        status: "active",
        description: "",
        imageUrl: "",
      });

      expect(withEmptyOptionals.success).toBe(true);
      expect(withEmptyOptionals.data.description).toBeNull();
      expect(withEmptyOptionals.data.imageUrl).toBeNull();
    });

    it("rejects missing numeric values and invalid fields", () => {
      const result = productFormSchema.safeParse({
        name: "X",
        sku: "bad sku!",
        category: "Unknown",
        price: "",
        stock: "",
        status: "archived",
        description: "a".repeat(501),
        imageUrl: "ftp://example.com/image.png",
      });

      expect(result.success).toBe(false);
      expect(errorMessages(result)).toEqual(
        expect.arrayContaining([
          "Product name must be at least 2 characters.",
          "Use letters, numbers, hyphens, or underscores.",
          "Choose a valid category.",
          "Enter a valid price.",
          "Enter a valid stock quantity.",
          "Choose a valid product status.",
          "Description must be 500 characters or fewer.",
          "Enter a valid image URL starting with http:// or https://.",
        ]),
      );
    });

    it("rejects non-positive prices and negative or fractional stock", () => {
      const fractionalStock = productFormSchema.safeParse({
        name: "Test Product",
        sku: "NX-TEST-001",
        category: "Analytics",
        price: "0",
        stock: "-1.5",
        status: "active",
      });

      expect(fractionalStock.success).toBe(false);
      expect(errorMessages(fractionalStock)).toEqual(
        expect.arrayContaining([
          "Price must be greater than zero.",
          "Stock must be a whole number.",
        ]),
      );

      const negativeStock = productFormSchema.safeParse({
        name: "Test Product",
        sku: "NX-TEST-001",
        category: "Analytics",
        price: "10",
        stock: "-1",
        status: "active",
      });

      expect(negativeStock.success).toBe(false);
      expect(errorMessages(negativeStock)).toContain(
        "Stock cannot be negative.",
      );
    });
  });
});
