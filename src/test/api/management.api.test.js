import { beforeEach, describe, expect, it } from "vitest";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/services/api/users.api";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  updateProductStatus,
} from "@/services/api/products.api";
import {
  getOrder,
  getOrders,
  updateOrderStatus,
} from "@/services/api/orders.api";
import { ENDPOINTS } from "@/services/api/endpoints";
import { useAuthStore } from "@/store/authStore";
import { signInAs } from "../helpers/auth";

describe("mock management API", () => {
  beforeEach(() => {
    signInAs("admin");
  });

  describe("users", () => {
    it("lists sorted, paginated users with summary metrics", async () => {
      const firstPage = await getUsers({
        page: 1,
        pageSize: 5,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      expect(firstPage.items.map((user) => user.id)).toEqual([
        "user-024",
        "user-023",
        "user-022",
        "user-021",
        "user-020",
      ]);
      expect(firstPage.pagination).toEqual({
        page: 1,
        pageSize: 5,
        totalItems: 24,
        totalPages: 5,
      });
      expect(firstPage.summary).toEqual({
        total: 24,
        active: 19,
        inactive: 5,
        administrators: 4,
      });

      const lastPage = await getUsers({
        page: 3,
        pageSize: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      expect(lastPage.items.map((user) => user.id)).toEqual([
        "user-004",
        "user-003",
        "user-002",
        "user-001",
      ]);
      expect(lastPage.pagination.totalPages).toBe(3);
    });

    it("filters users by search, role, and status", async () => {
      const searchResults = await getUsers({ search: "priya" });

      expect(searchResults.items).toHaveLength(1);
      expect(searchResults.items[0]).toMatchObject({
        id: "user-003",
        name: "Priya Shah",
      });

      const admins = await getUsers({
        role: "admin",
        status: "active",
        pageSize: 100,
      });

      expect(admins.items).toHaveLength(3);
      expect(admins.items.every((user) => user.role === "admin")).toBe(true);
      expect(admins.items.every((user) => user.status === "active")).toBe(true);
      expect(admins.summary.administrators).toBe(4);

      const inactive = await getUsers({ status: "inactive", pageSize: 100 });

      expect(inactive.items).toHaveLength(5);
      expect(inactive.items.every((user) => user.status === "inactive")).toBe(
        true,
      );
    });

    it("creates and updates users while rejecting duplicate emails", async () => {
      const created = await createUser({
        name: "Taylor Reed",
        email: "Taylor.Reed@Nexus.Test",
        role: "manager",
        status: "active",
        phone: "+1 (415) 555-0199",
        department: "Operations",
      });

      expect(created).toMatchObject({
        id: "user-025",
        name: "Taylor Reed",
        email: "taylor.reed@nexus.test",
        role: "manager",
        status: "active",
      });

      const updated = await updateUser(created.id, {
        name: "Taylor Reed-Smith",
        department: "Customer Success",
      });

      expect(updated).toMatchObject({
        name: "Taylor Reed-Smith",
        department: "Customer Success",
        email: "taylor.reed@nexus.test",
      });

      await expect(
        createUser({
          name: "Duplicate Admin",
          email: "admin@nexus.test",
          role: "manager",
          status: "active",
        }),
      ).rejects.toThrow("A user with this email already exists.");

      await expect(
        updateUser(created.id, { email: "admin@nexus.test" }),
      ).rejects.toThrow("A user with this email already exists.");
    });

    it("protects the signed-in account from destructive changes", async () => {
      await expect(
        updateUser("user-001", { status: "inactive" }),
      ).rejects.toThrow("You cannot change your own account status.");

      await expect(
        updateUser("user-001", { role: "manager" }),
      ).rejects.toThrow("You cannot change your own role.");

      await expect(
        updateUser("user-001", { email: "someone@nexus.test" }),
      ).rejects.toThrow(
        "You cannot change your own email from user management.",
      );

      await expect(deleteUser("user-001")).rejects.toThrow(
        "You cannot delete your own account.",
      );

      const updated = await updateUser("user-001", {
        name: "Alex Morgan",
        phone: "+1 (415) 555-0100",
        department: "Administration",
      });

      expect(updated.phone).toBe("+1 (415) 555-0100");
    });

    it("requires authentication for management resources", async () => {
      useAuthStore.setState({ accessToken: null });

      await expect(getUsers()).rejects.toThrow("Authentication is required.");
      await expect(getProducts()).rejects.toThrow(
        "Authentication is required.",
      );
      await expect(getOrders()).rejects.toThrow("Authentication is required.");
    });
  });

  describe("products", () => {
    it("lists products with stock summaries and low-stock filtering", async () => {
      const firstPage = await getProducts({
        page: 1,
        pageSize: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      expect(firstPage.items.map((product) => product.id)).toEqual([
        "product-024",
        "product-023",
        "product-022",
        "product-021",
        "product-020",
        "product-019",
        "product-018",
        "product-017",
        "product-016",
        "product-015",
      ]);
      expect(firstPage.summary).toEqual({
        total: 24,
        active: 17,
        draft: 5,
        inactive: 2,
        lowStock: 9,
      });

      const lowStock = await getProducts({
        stock: "low_stock",
        pageSize: 100,
      });

      expect(lowStock.items).toHaveLength(7);
      expect(
        lowStock.items.every(
          (product) => product.stock > 0 && product.stock <= 10,
        ),
      ).toBe(true);

      const outOfStock = await getProducts({
        stock: "out_of_stock",
        pageSize: 100,
      });

      expect(outOfStock.items.map((product) => product.id)).toEqual([
        "product-011",
        "product-004",
      ]);

      const inStock = await getProducts({
        stock: "in_stock",
        pageSize: 100,
      });

      expect(inStock.items).toHaveLength(15);
    });

    it("filters by category and status and sorts by price", async () => {
      const securityDrafts = await getProducts({
        category: "Security",
        status: "draft",
        pageSize: 100,
      });

      expect(securityDrafts.items).toHaveLength(1);
      expect(securityDrafts.items[0]).toMatchObject({
        id: "product-008",
        name: "Incident Response Pack",
        category: "Security",
        status: "draft",
      });

      const cheapest = await getProducts({
        sortBy: "price",
        sortOrder: "asc",
        pageSize: 1,
      });

      expect(cheapest.items[0]).toMatchObject({
        id: "product-012",
        name: "Automation Templates",
        price: 19,
      });
    });

    it("supports product CRUD and rejects duplicate SKUs", async () => {
      const created = await createProduct({
        name: "Test Product",
        sku: "nx-test-001",
        category: "Analytics",
        price: 49.99,
        stock: 5,
        status: "draft",
        description: "A test product.",
        imageUrl: null,
      });

      expect(created).toMatchObject({
        id: "product-025",
        sku: "NX-TEST-001",
        price: 49.99,
        stock: 5,
        status: "draft",
      });

      const updated = await updateProduct(created.id, {
        name: "Updated Product",
        price: 59.5,
        stock: 8,
      });

      expect(updated).toMatchObject({
        name: "Updated Product",
        price: 59.5,
        stock: 8,
        sku: "NX-TEST-001",
      });

      const activated = await updateProductStatus(created.id, "active");

      expect(activated.status).toBe("active");

      await expect(
        createProduct({
          name: "Duplicate SKU",
          sku: "NX-ANL-001",
          category: "Analytics",
          price: 10,
          stock: 1,
          status: "active",
        }),
      ).rejects.toThrow("A product with this SKU already exists.");

      await expect(
        updateProduct(created.id, { sku: "NX-ANL-001" }),
      ).rejects.toThrow("A product with this SKU already exists.");

      await expect(
        createProduct({
          name: "Invalid Product",
          sku: "NX-INVALID-001",
          category: "Analytics",
          price: 0,
          stock: -1,
          status: "active",
        }),
      ).rejects.toThrow("Price must be a positive number.");

      await deleteProduct(created.id);

      await expect(getProduct(created.id)).rejects.toThrow(
        "The requested record could not be found.",
      );
    });
  });

  describe("orders", () => {
    it("lists orders with status, payment, and date filters", async () => {
      const firstPage = await getOrders({
        page: 1,
        pageSize: 10,
        sortBy: "date",
        sortOrder: "desc",
      });

      expect(firstPage.items.map((order) => order.id)).toEqual([
        "ORD-1001",
        "ORD-1002",
        "ORD-1003",
        "ORD-1004",
        "ORD-1005",
        "ORD-1006",
        "ORD-1007",
        "ORD-1008",
        "ORD-1009",
        "ORD-1010",
      ]);
      expect(firstPage.summary).toEqual({
        total: 30,
        pending: 4,
        processing: 6,
        shipped: 4,
        delivered: 12,
        completed: 12,
        cancelled: 4,
      });

      const pending = await getOrders({
        status: "pending",
        pageSize: 100,
      });

      expect(pending.items).toHaveLength(4);
      expect(pending.items.every((order) => order.status === "pending")).toBe(
        true,
      );

      const refunded = await getOrders({
        paymentStatus: "refunded",
        pageSize: 100,
      });

      expect(refunded.items).toHaveLength(5);
      expect(
        refunded.items.every((order) => order.paymentStatus === "refunded"),
      ).toBe(true);

      const searched = await getOrders({ search: "maya chen", pageSize: 100 });

      expect(searched.items.length).toBeGreaterThan(0);
      expect(
        searched.items.every((order) =>
          order.customer.name.toLowerCase().includes("maya chen"),
        ),
      ).toBe(true);

      const firstOrder = await getOrder("ORD-1001");
      const dateKey = firstOrder.date.slice(0, 10);
      const dated = await getOrders({
        dateFrom: dateKey,
        dateTo: dateKey,
        pageSize: 100,
      });

      expect(dated.items.map((order) => order.id)).toEqual(["ORD-1001"]);
    });

    it("validates date filters", async () => {
      await expect(
        getOrders({ dateFrom: "2026-03-10", dateTo: "2026-03-01" }),
      ).rejects.toThrow("The start date must be on or before the end date.");

      await expect(
        getOrders({ dateFrom: "not-a-date" }),
      ).rejects.toThrow("Start date must use the YYYY-MM-DD format.");
    });

    it("enforces the fulfillment transition graph", async () => {
      const processing = await updateOrderStatus("ORD-1003", "processing");

      expect(processing.status).toBe("processing");

      const shipped = await updateOrderStatus("ORD-1003", "shipped");

      expect(shipped.status).toBe("shipped");

      const delivered = await updateOrderStatus("ORD-1003", "delivered");

      expect(delivered.status).toBe("delivered");

      await expect(
        updateOrderStatus("ORD-1003", "processing"),
      ).rejects.toThrow(
        "Order ORD-1003 cannot move from delivered to processing.",
      );

      await expect(updateOrderStatus("ORD-1003", "cancelled")).rejects.toThrow(
        "Order ORD-1003 cannot move from delivered to cancelled.",
      );

      await expect(updateOrderStatus("ORD-1009", "shipped")).rejects.toThrow(
        "Order ORD-1009 cannot move from pending to shipped.",
      );

      const cancelled = await updateOrderStatus("ORD-1009", "cancelled");

      expect(cancelled.status).toBe("cancelled");

      await expect(
        updateOrderStatus("ORD-1009", "delivered"),
      ).rejects.toThrow(
        "Order ORD-1009 cannot move from cancelled to delivered.",
      );
    });

    it("rejects invalid order status values and missing orders", async () => {
      await expect(updateOrderStatus("ORD-1003", "refunded")).rejects.toThrow(
        "Choose a valid order status.",
      );

      await expect(getOrder("ORD-9999")).rejects.toThrow(
        "The requested record could not be found.",
      );

      await expect(updateOrderStatus("ORD-9999", "processing")).rejects.toThrow(
        "The requested order could not be found.",
      );
    });
  });

  it("exposes the expected management endpoint paths", () => {
    expect(ENDPOINTS.users.list).toBe("/users");
    expect(ENDPOINTS.users.detail("user-001")).toBe("/users/user-001");
    expect(ENDPOINTS.users.status("user-001")).toBe("/users/user-001/status");
    expect(ENDPOINTS.products.list).toBe("/products");
    expect(ENDPOINTS.products.detail("product-001")).toBe(
      "/products/product-001",
    );
    expect(ENDPOINTS.products.status("product-001")).toBe(
      "/products/product-001/status",
    );
    expect(ENDPOINTS.orders.list).toBe("/orders");
    expect(ENDPOINTS.orders.detail("ORD-1001")).toBe("/orders/ORD-1001");
    expect(ENDPOINTS.orders.status("ORD-1001")).toBe(
      "/orders/ORD-1001/status",
    );
  });
});
