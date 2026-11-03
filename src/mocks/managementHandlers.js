import { endOfDay, parseISO } from "date-fns";
import { delay, http } from "msw";
import {
  MANAGEMENT_ROLES,
  MAX_MANAGEMENT_PAGE_SIZE,
  PAYMENT_STATUSES,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  STOCK_FILTERS,
  USER_STATUSES,
  canTransitionOrderStatus,
  ORDER_STATUSES,
  LOW_STOCK_THRESHOLD,
  MANAGEMENT_PAGE_SIZE,
} from "@/constants/management";
import { parseDateKey } from "@/utils/dateRange";
import {
  buildOrdersSummary,
  buildProductsSummary,
  buildUsersSummary,
  createProductRecord,
  createUserRecord,
  deleteProductRecord,
  deleteUserRecord,
  findOrderById,
  findProductById,
  findProductBySku,
  findUserByEmail,
  findUserById,
  getOrders,
  getProducts,
  getUsers,
  updateOrderStatusRecord,
  updateProductRecord,
  updateUserRecord,
} from "./data/management";
import {
  errorResponse,
  getAuthenticatedAccount,
  MOCK_DELAY,
  successResponse,
} from "./http";

const USERS_PATH = /\/users\/?$/;
const USER_DETAIL_PATH = /\/users\/(?<id>[^/]+)\/?$/;
const USER_STATUS_PATH = /\/users\/(?<id>[^/]+)\/status\/?$/;
const PRODUCTS_PATH = /\/products\/?$/;
const PRODUCT_DETAIL_PATH = /\/products\/(?<id>[^/]+)\/?$/;
const PRODUCT_STATUS_PATH = /\/products\/(?<id>[^/]+)\/status\/?$/;
const ORDERS_PATH = /\/orders\/?$/;
const ORDER_DETAIL_PATH = /\/orders\/(?<id>[^/]+)\/?$/;
const ORDER_STATUS_PATH = /\/orders\/(?<id>[^/]+)\/status\/?$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SKU_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

class ManagementRequestError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "ManagementRequestError";
    this.status = status;
  }
}

function fail(message, status = 400) {
  throw new ManagementRequestError(message, status);
}

function handleRequestError(error) {
  if (error instanceof ManagementRequestError) {
    return errorResponse(error.status, error.message);
  }

  return errorResponse(400, "The request could not be processed.");
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    fail("The request body could not be read.");
  }

  return null;
}

function getRecordId(request, params) {
  if (params?.id) {
    return decodeURIComponent(params.id);
  }

  const segments = new URL(request.url).pathname
    .split("/")
    .filter(Boolean);
  const lastSegment = segments.at(-1);
  const id =
    lastSegment === "status" ? segments.at(-2) : lastSegment;

  return decodeURIComponent(id ?? "");
}

function normalizeEmail(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function readSearch(searchParams) {
  const search = (searchParams.get("search") ?? "").trim();

  if (search.length > 100) {
    fail("Search queries must be 100 characters or fewer.");
  }

  return search.toLowerCase();
}

function readOptionalEnum(searchParams, key, allowed, label) {
  const value = (searchParams.get(key) ?? "").trim();

  if (!value || value === "all") {
    return null;
  }

  if (!allowed.includes(value)) {
    fail(`Choose a valid ${label} filter.`);
  }

  return value;
}

function readSort(searchParams, allowedSortFields, defaultSortBy) {
  const sortBy = (searchParams.get("sortBy") ?? defaultSortBy).trim();
  const sortOrder = (searchParams.get("sortOrder") ?? "desc").trim();

  if (!allowedSortFields.includes(sortBy)) {
    fail("Choose a valid sort field.");
  }

  if (sortOrder !== "asc" && sortOrder !== "desc") {
    fail("Sort order must be asc or desc.");
  }

  return { sortBy, sortOrder };
}

function readPagination(searchParams) {
  const pageValue = searchParams.get("page") ?? "1";
  const pageSizeValue =
    searchParams.get("pageSize") ?? String(MANAGEMENT_PAGE_SIZE);

  if (!/^\d+$/.test(pageValue) || Number(pageValue) < 1) {
    fail("Page must be a positive integer.");
  }

  if (!/^\d+$/.test(pageSizeValue)) {
    fail("Page size must be a positive integer.");
  }

  const page = Number(pageValue);
  const pageSize = Number(pageSizeValue);

  if (pageSize < 1 || pageSize > MAX_MANAGEMENT_PAGE_SIZE) {
    fail(`Page size must be between 1 and ${MAX_MANAGEMENT_PAGE_SIZE}.`);
  }

  return { page, pageSize };
}

function paginate(items, { page, pageSize }) {
  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

function sortItems(items, sortBy, sortOrder, accessors) {
  return [...items].sort((first, second) => {
    const firstValue = accessors[sortBy](first);
    const secondValue = accessors[sortBy](second);
    let result;

    if (firstValue instanceof Date && secondValue instanceof Date) {
      result = firstValue.getTime() - secondValue.getTime();
    } else if (
      typeof firstValue === "number" &&
      typeof secondValue === "number"
    ) {
      result = firstValue - secondValue;
    } else {
      result = String(firstValue).localeCompare(String(secondValue), "en", {
        sensitivity: "base",
      });
    }

    if (result !== 0) {
      return sortOrder === "asc" ? result : -result;
    }

    return first.id.localeCompare(second.id);
  });
}

function readDateFilter(searchParams, key, label) {
  const value = (searchParams.get(key) ?? "").trim();

  if (!value) {
    return null;
  }

  const date = parseDateKey(value);

  if (!date) {
    fail(`${label} must use the YYYY-MM-DD format.`);
  }

  return date;
}

function createListHandler(path, message, buildList) {
  return http.get(path, async ({ request }) => {
    await delay(MOCK_DELAY);

    if (!getAuthenticatedAccount(request)) {
      return errorResponse(401, "Authentication is required.");
    }

    try {
      return successResponse(message, buildList(new URL(request.url).searchParams));
    } catch (error) {
      return handleRequestError(error);
    }
  });
}

function createDetailHandler(path, message, findRecord) {
  return http.get(path, async ({ request, params }) => {
    await delay(MOCK_DELAY);

    if (!getAuthenticatedAccount(request)) {
      return errorResponse(401, "Authentication is required.");
    }

      const record = findRecord(getRecordId(request, params));

    if (!record) {
      return errorResponse(404, "The requested record could not be found.");
    }

    return successResponse(message, record);
  });
}

function validateUserInput(payload, { partial = false } = {}) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    fail("The request body must be a valid user payload.");
  }

  const hasField = (field) =>
    Object.prototype.hasOwnProperty.call(payload, field);
  const changes = {};

  if (!partial || hasField("name")) {
    const name = typeof payload.name === "string" ? payload.name.trim() : "";

    if (name.length < 2 || name.length > 80) {
      fail("Full name must be between 2 and 80 characters.");
    }

    changes.name = name;
  }

  if (!partial || hasField("email")) {
    const email = typeof payload.email === "string" ? payload.email.trim() : "";

    if (!EMAIL_PATTERN.test(email) || email.length > 120) {
      fail("Enter a valid email address.");
    }

    changes.email = email;
  }

  if (!partial || hasField("role")) {
    if (!MANAGEMENT_ROLES.includes(payload.role)) {
      fail("Choose a valid role.");
    }

    changes.role = payload.role;
  }

  if (!partial || hasField("status")) {
    if (!USER_STATUSES.includes(payload.status)) {
      fail("Choose a valid user status.");
    }

    changes.status = payload.status;
  }

  if (!partial || hasField("phone")) {
    if (payload.phone != null && typeof payload.phone !== "string") {
      fail("Phone number must be text.");
    }

    const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";

    if (phone.length > 30) {
      fail("Phone number must be 30 characters or fewer.");
    }

    changes.phone = phone || null;
  }

  if (!partial || hasField("department")) {
    if (payload.department != null && typeof payload.department !== "string") {
      fail("Department must be text.");
    }

    const department =
      typeof payload.department === "string"
        ? payload.department.trim()
        : "";

    if (department.length > 60) {
      fail("Department must be 60 characters or fewer.");
    }

    changes.department = department || null;
  }

  if (Object.keys(changes).length === 0) {
    fail("No supported user fields were provided.");
  }

  return changes;
}

function validateProductInput(payload, { partial = false } = {}) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    fail("The request body must be a valid product payload.");
  }

  const hasField = (field) =>
    Object.prototype.hasOwnProperty.call(payload, field);
  const changes = {};

  if (!partial || hasField("name")) {
    const name = typeof payload.name === "string" ? payload.name.trim() : "";

    if (name.length < 2 || name.length > 120) {
      fail("Product name must be between 2 and 120 characters.");
    }

    changes.name = name;
  }

  if (!partial || hasField("sku")) {
    const sku = typeof payload.sku === "string" ? payload.sku.trim() : "";

    if (!SKU_PATTERN.test(sku) || sku.length > 40) {
      fail("Enter a valid SKU using letters, numbers, hyphens, or underscores.");
    }

    changes.sku = sku.toUpperCase();
  }

  if (!partial || hasField("category")) {
    if (!PRODUCT_CATEGORIES.includes(payload.category)) {
      fail("Choose a valid product category.");
    }

    changes.category = payload.category;
  }

  if (!partial || hasField("price")) {
    const price = Number(payload.price);

    if (!Number.isFinite(price) || price <= 0) {
      fail("Price must be a positive number.");
    }

    if (price > 1000000) {
      fail("Price must be 1,000,000 or less.");
    }

    changes.price = Math.round(price * 100) / 100;
  }

  if (!partial || hasField("stock")) {
    const stock = Number(payload.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      fail("Stock must be a non-negative whole number.");
    }

    if (stock > 1000000) {
      fail("Stock must be 1,000,000 or less.");
    }

    changes.stock = stock;
  }

  if (!partial || hasField("status")) {
    if (!PRODUCT_STATUSES.includes(payload.status)) {
      fail("Choose a valid product status.");
    }

    changes.status = payload.status;
  }

  if (!partial || hasField("description")) {
    if (payload.description != null && typeof payload.description !== "string") {
      fail("Description must be text.");
    }

    const description =
      typeof payload.description === "string"
        ? payload.description.trim()
        : "";

    if (description.length > 500) {
      fail("Description must be 500 characters or fewer.");
    }

    changes.description = description || null;
  }

  if (!partial || hasField("imageUrl")) {
    if (payload.imageUrl != null && typeof payload.imageUrl !== "string") {
      fail("Image URL must be text.");
    }

    const imageUrl =
      typeof payload.imageUrl === "string" ? payload.imageUrl.trim() : "";

    if (
      imageUrl &&
      (!/^https?:\/\//i.test(imageUrl) || imageUrl.length > 500)
    ) {
      fail("Enter a valid image URL starting with http:// or https://.");
    }

    changes.imageUrl = imageUrl || null;
  }

  if (Object.keys(changes).length === 0) {
    fail("No supported product fields were provided.");
  }

  return changes;
}

export const managementHandlers = [
  createListHandler(USERS_PATH, "Users retrieved", (searchParams) => {
    const search = readSearch(searchParams);
    const role = readOptionalEnum(
      searchParams,
      "role",
      MANAGEMENT_ROLES,
      "role",
    );
    const status = readOptionalEnum(
      searchParams,
      "status",
      USER_STATUSES,
      "status",
    );
    const sort = readSort(
      searchParams,
      ["name", "createdAt"],
      "createdAt",
    );
    const pagination = readPagination(searchParams);
    const filtered = getUsers().filter((user) => {
      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);
      const matchesRole = !role || user.role === role;
      const matchesStatus = !status || user.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
    const sorted = sortItems(filtered, sort.sortBy, sort.sortOrder, {
      name: (user) => user.name,
      createdAt: (user) => new Date(user.createdAt),
    });

    return {
      ...paginate(sorted, pagination),
      summary: buildUsersSummary(),
    };
  }),

  createDetailHandler(
    USER_DETAIL_PATH,
    "User retrieved",
    findUserById,
  ),

  http.post(USERS_PATH, async ({ request }) => {
    await delay(MOCK_DELAY);

    if (!getAuthenticatedAccount(request)) {
      return errorResponse(401, "Authentication is required.");
    }

    try {
      const payload = await readJsonBody(request);
      const changes = validateUserInput(payload);

      if (findUserByEmail(changes.email)) {
        fail("A user with this email already exists.", 409);
      }

      return successResponse(
        "User created",
        createUserRecord(changes),
        201,
      );
    } catch (error) {
      return handleRequestError(error);
    }
  }),

  http.patch(USER_STATUS_PATH, async ({ request, params }) => {
    await delay(MOCK_DELAY);

    const account = getAuthenticatedAccount(request);

    if (!account) {
      return errorResponse(401, "Authentication is required.");
    }

    try {
      const payload = await readJsonBody(request);
      const status = payload?.status;

      if (!USER_STATUSES.includes(status)) {
        fail("Choose a valid user status.");
      }

      const user = findUserById(getRecordId(request, params));

      if (!user) {
        return errorResponse(404, "The requested user could not be found.");
      }

      if (user.id === account.id && status !== user.status) {
        fail("You cannot change your own account status.", 403);
      }

      return successResponse(
        "User status updated",
        updateUserRecord(user.id, { status }),
      );
    } catch (error) {
      return handleRequestError(error);
    }
  }),

  http.patch(USER_DETAIL_PATH, async ({ request, params }) => {
    await delay(MOCK_DELAY);

    const account = getAuthenticatedAccount(request);

    if (!account) {
      return errorResponse(401, "Authentication is required.");
    }

    try {
      const user = findUserById(getRecordId(request, params));

      if (!user) {
        return errorResponse(404, "The requested user could not be found.");
      }

      const payload = await readJsonBody(request);
      const changes = validateUserInput(payload, { partial: true });

      if (user.id === account.id) {
        if (changes.role && changes.role !== user.role) {
          fail("You cannot change your own role.", 403);
        }

        if (changes.status && changes.status !== user.status) {
          fail("You cannot change your own account status.", 403);
        }

        if (
          changes.email &&
          normalizeEmail(changes.email) !== normalizeEmail(user.email)
        ) {
          fail("You cannot change your own email from user management.", 403);
        }
      }

      if (findUserByEmail(changes.email, user.id)) {
        fail("A user with this email already exists.", 409);
      }

      return successResponse(
        "User updated",
        updateUserRecord(user.id, changes),
      );
    } catch (error) {
      return handleRequestError(error);
    }
  }),

  http.delete(USER_DETAIL_PATH, async ({ request, params }) => {
    await delay(MOCK_DELAY);

    const account = getAuthenticatedAccount(request);

    if (!account) {
      return errorResponse(401, "Authentication is required.");
    }

    const user = findUserById(getRecordId(request, params));

    if (!user) {
      return errorResponse(404, "The requested user could not be found.");
    }

    if (user.id === account.id) {
      return errorResponse(403, "You cannot delete your own account.");
    }

    deleteUserRecord(user.id);

    return successResponse("User deleted", { id: user.id });
  }),

  createListHandler(PRODUCTS_PATH, "Products retrieved", (searchParams) => {
    const search = readSearch(searchParams);
    const category = readOptionalEnum(
      searchParams,
      "category",
      PRODUCT_CATEGORIES,
      "category",
    );
    const status = readOptionalEnum(
      searchParams,
      "status",
      PRODUCT_STATUSES,
      "status",
    );
    const stock = readOptionalEnum(
      searchParams,
      "stock",
      STOCK_FILTERS,
      "stock",
    );
    const sort = readSort(
      searchParams,
      ["name", "price", "stock", "createdAt"],
      "createdAt",
    );
    const pagination = readPagination(searchParams);
    const filtered = getProducts().filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search);
      const matchesCategory =
        !category || product.category === category;
      const matchesStatus = !status || product.status === status;
      const matchesStock =
        !stock ||
        (stock === "in_stock" && product.stock > LOW_STOCK_THRESHOLD) ||
        (stock === "low_stock" &&
          product.stock > 0 &&
          product.stock <= LOW_STOCK_THRESHOLD) ||
        (stock === "out_of_stock" && product.stock === 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesStock
      );
    });
    const sorted = sortItems(filtered, sort.sortBy, sort.sortOrder, {
      name: (product) => product.name,
      price: (product) => product.price,
      stock: (product) => product.stock,
      createdAt: (product) => new Date(product.createdAt),
    });

    return {
      ...paginate(sorted, pagination),
      summary: buildProductsSummary(),
    };
  }),

  createDetailHandler(
    PRODUCT_DETAIL_PATH,
    "Product retrieved",
    findProductById,
  ),

  http.post(PRODUCTS_PATH, async ({ request }) => {
    await delay(MOCK_DELAY);

    if (!getAuthenticatedAccount(request)) {
      return errorResponse(401, "Authentication is required.");
    }

    try {
      const payload = await readJsonBody(request);
      const changes = validateProductInput(payload);

      if (findProductBySku(changes.sku)) {
        fail("A product with this SKU already exists.", 409);
      }

      return successResponse(
        "Product created",
        createProductRecord(changes),
        201,
      );
    } catch (error) {
      return handleRequestError(error);
    }
  }),

  http.patch(PRODUCT_STATUS_PATH, async ({ request, params }) => {
    await delay(MOCK_DELAY);

    if (!getAuthenticatedAccount(request)) {
      return errorResponse(401, "Authentication is required.");
    }

    try {
      const payload = await readJsonBody(request);

      if (!PRODUCT_STATUSES.includes(payload?.status)) {
        fail("Choose a valid product status.");
      }

      const product = findProductById(getRecordId(request, params));

      if (!product) {
        return errorResponse(404, "The requested product could not be found.");
      }

      return successResponse(
        "Product status updated",
        updateProductRecord(product.id, { status: payload.status }),
      );
    } catch (error) {
      return handleRequestError(error);
    }
  }),

  http.patch(PRODUCT_DETAIL_PATH, async ({ request, params }) => {
    await delay(MOCK_DELAY);

    if (!getAuthenticatedAccount(request)) {
      return errorResponse(401, "Authentication is required.");
    }

    try {
      const product = findProductById(getRecordId(request, params));

      if (!product) {
        return errorResponse(404, "The requested product could not be found.");
      }

      const payload = await readJsonBody(request);
      const changes = validateProductInput(payload, { partial: true });

      if (findProductBySku(changes.sku, product.id)) {
        fail("A product with this SKU already exists.", 409);
      }

      return successResponse(
        "Product updated",
        updateProductRecord(product.id, changes),
      );
    } catch (error) {
      return handleRequestError(error);
    }
  }),

  http.delete(PRODUCT_DETAIL_PATH, async ({ request, params }) => {
    await delay(MOCK_DELAY);

    if (!getAuthenticatedAccount(request)) {
      return errorResponse(401, "Authentication is required.");
    }

    const product = findProductById(getRecordId(request, params));

    if (!product) {
      return errorResponse(404, "The requested product could not be found.");
    }

    deleteProductRecord(product.id);

    return successResponse("Product deleted", { id: product.id });
  }),

  createListHandler(ORDERS_PATH, "Orders retrieved", (searchParams) => {
    const search = readSearch(searchParams);
    const status = readOptionalEnum(
      searchParams,
      "status",
      ORDER_STATUSES,
      "order status",
    );
    const paymentStatus = readOptionalEnum(
      searchParams,
      "paymentStatus",
      PAYMENT_STATUSES,
      "payment status",
    );
    const dateFrom = readDateFilter(searchParams, "dateFrom", "Start date");
    const dateTo = readDateFilter(searchParams, "dateTo", "End date");

    if (dateFrom && dateTo && dateFrom > dateTo) {
      fail("The start date must be on or before the end date.");
    }

    const sort = readSort(searchParams, ["date", "total"], "date");
    const pagination = readPagination(searchParams);
    const endDate = dateTo ? endOfDay(dateTo) : null;
    const filtered = getOrders().filter((order) => {
      const matchesSearch =
        !search ||
        order.id.toLowerCase().includes(search) ||
        order.customer.name.toLowerCase().includes(search) ||
        order.customer.email.toLowerCase().includes(search);
      const matchesStatus = !status || order.status === status;
      const matchesPayment =
        !paymentStatus || order.paymentStatus === paymentStatus;
      const orderDate = parseISO(order.date);
      const matchesDate =
        (!dateFrom || orderDate >= dateFrom) &&
        (!endDate || orderDate <= endDate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesDate
      );
    });
    const sorted = sortItems(filtered, sort.sortBy, sort.sortOrder, {
      date: (order) => new Date(order.date),
      total: (order) => order.total,
    });

    return {
      ...paginate(sorted, pagination),
      summary: buildOrdersSummary(),
    };
  }),

  createDetailHandler(
    ORDER_DETAIL_PATH,
    "Order retrieved",
    findOrderById,
  ),

  http.patch(ORDER_STATUS_PATH, async ({ request, params }) => {
    await delay(MOCK_DELAY);

    if (!getAuthenticatedAccount(request)) {
      return errorResponse(401, "Authentication is required.");
    }

    try {
      const payload = await readJsonBody(request);
      const nextStatus = payload?.status;

      if (!ORDER_STATUSES.includes(nextStatus)) {
        fail("Choose a valid order status.");
      }

      const order = findOrderById(getRecordId(request, params));

      if (!order) {
        return errorResponse(404, "The requested order could not be found.");
      }

      if (order.status === nextStatus) {
        fail(`Order ${order.id} is already marked as ${nextStatus}.`, 409);
      }

      if (!canTransitionOrderStatus(order.status, nextStatus)) {
        fail(
          `Order ${order.id} cannot move from ${order.status} to ${nextStatus}.`,
          409,
        );
      }

      return successResponse(
        "Order status updated",
        updateOrderStatusRecord(order.id, nextStatus),
      );
    } catch (error) {
      return handleRequestError(error);
    }
  }),
];
