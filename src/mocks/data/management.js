import { subDays, subHours } from "date-fns";
import {
  LOW_STOCK_THRESHOLD,
  PAYMENT_METHODS,
} from "@/constants/management";
import { ROLES } from "@/constants/permissions";

const USER_SEEDS = Object.freeze([
  ["Alex Morgan", "admin@nexus.test", ROLES.ADMIN, "active", 420, 1, "Administration"],
  ["Jordan Lee", "manager@nexus.test", ROLES.MANAGER, "active", 380, 5, "Operations"],
  ["Priya Shah", "priya.shah@nexus.test", ROLES.MANAGER, "active", 350, 8, "Customer Success"],
  ["Ethan Brooks", "ethan.brooks@nexus.test", ROLES.ADMIN, "inactive", 330, 1160, "Finance"],
  ["Maya Chen", "maya.chen@nexus.test", ROLES.MANAGER, "active", 300, 2, "Marketing"],
  ["Liam Bennett", "liam.bennett@nexus.test", ROLES.MANAGER, "active", 280, 26, "Engineering"],
  ["Sofia Alvarez", "sofia.alvarez@nexus.test", ROLES.ADMIN, "active", 260, 12, "Operations"],
  ["Noah Williams", "noah.williams@nexus.test", ROLES.MANAGER, "inactive", 240, 980, "Sales"],
  ["Amara Okafor", "amara.okafor@nexus.test", ROLES.MANAGER, "active", 220, 4, "Support"],
  ["Lucas Meyer", "lucas.meyer@nexus.test", ROLES.MANAGER, "active", 200, 48, "Product"],
  ["Hana Kim", "hana.kim@nexus.test", ROLES.MANAGER, "active", 180, 3, "Design"],
  ["Oliver Grant", "oliver.grant@nexus.test", ROLES.MANAGER, "active", 160, 30, "Finance"],
  ["Zara Ahmed", "zara.ahmed@nexus.test", ROLES.MANAGER, "active", 140, 6, "Engineering"],
  ["Mateo Rossi", "mateo.rossi@nexus.test", ROLES.MANAGER, "inactive", 130, 760, "Operations"],
  ["Chloe Dubois", "chloe.dubois@nexus.test", ROLES.MANAGER, "active", 120, 9, "Marketing"],
  ["Daniel Kim", "daniel.kim@nexus.test", ROLES.ADMIN, "active", 110, 20, "Engineering"],
  ["Ava Thompson", "ava.thompson@nexus.test", ROLES.MANAGER, "active", 100, 11, "Support"],
  ["Ravi Patel", "ravi.patel@nexus.test", ROLES.MANAGER, "active", 90, 7, "Sales"],
  ["Elena Petrova", "elena.petrova@nexus.test", ROLES.MANAGER, "inactive", 80, 640, "Product"],
  ["Marcus Johnson", "marcus.johnson@nexus.test", ROLES.MANAGER, "active", 70, 14, "Operations"],
  ["Yuki Tanaka", "yuki.tanaka@nexus.test", ROLES.MANAGER, "active", 60, 5, "Design"],
  ["Grace Okafor", "grace.okafor@nexus.test", ROLES.MANAGER, "inactive", 50, 520, "Support"],
  ["Samir Haddad", "samir.haddad@nexus.test", ROLES.MANAGER, "active", 40, 10, "Finance"],
  ["Natalie Cole", "natalie.cole@nexus.test", ROLES.MANAGER, "active", 30, 2, "Customer Success"],
]);

const PRODUCT_SEEDS = Object.freeze([
  ["Nexus Analytics Suite", "NX-ANL-001", "Analytics", 79, 120, "active", 300, "A complete analytics workspace for revenue, acquisition, and retention reporting."],
  ["Command Center Pro", "NX-OPS-002", "Operations", 149, 64, "active", 280, "Centralized operational monitoring for fast-moving customer teams."],
  ["Workflow Automations", "NX-AUT-003", "Automation", 99, 8, "active", 260, "Automate recurring approvals, handoffs, and customer follow-ups."],
  ["Audit Log Add-on", "NX-SEC-004", "Security", 39, 0, "active", 240, "Extended audit history with exportable security events."],
  ["Priority Support", "NX-SVC-005", "Services", 199, 35, "active", 220, "Dedicated support coverage with a four-hour response target."],
  ["API Gateway", "NX-INT-006", "Integrations", 129, 12, "active", 200, "Rate-limited gateway access for internal and partner integrations."],
  ["Data Export Kit", "NX-ANL-007", "Analytics", 49, 4, "active", 190, "Scheduled exports for warehousing and business intelligence pipelines."],
  ["Incident Response Pack", "NX-SEC-008", "Security", 89, 18, "draft", 180, "Runbooks and escalation templates for security incidents."],
  ["Billing Connector", "NX-INT-009", "Integrations", 59, 6, "active", 170, "Connect billing events to the rest of the workspace."],
  ["Scheduled Reports", "NX-ANL-010", "Analytics", 29, 140, "active", 160, "Deliver recurring performance summaries to stakeholders."],
  ["Team Inbox", "NX-OPS-011", "Operations", 45, 0, "inactive", 150, "Shared inbox routing for support and account teams."],
  ["Automation Templates", "NX-AUT-012", "Automation", 19, 75, "active", 140, "Prebuilt automation recipes for common administrative tasks."],
  ["SSO Add-on", "NX-SEC-013", "Security", 119, 22, "active", 130, "Single sign-on enforcement with directory synchronization."],
  ["Onboarding Package", "NX-SVC-014", "Services", 249, 9, "active", 120, "Guided workspace setup with migration and training support."],
  ["Webhook Relay", "NX-INT-015", "Integrations", 35, 88, "draft", 110, "Reliable webhook delivery with retry and replay controls."],
  ["Custom Dashboards", "NX-ANL-016", "Analytics", 69, 33, "draft", 100, "Build reusable, role-specific reporting dashboards."],
  ["Workflow Studio", "NX-AUT-017", "Automation", 159, 15, "active", 90, "Visual builder for multi-step operational workflows."],
  ["Asset Registry", "NX-OPS-018", "Operations", 99, 5, "active", 80, "Track operational assets, ownership, and lifecycle status."],
  ["Compliance Reports", "NX-SEC-019", "Security", 149, 14, "inactive", 70, "Generate evidence packs for common compliance reviews."],
  ["Dedicated Support", "NX-SVC-020", "Services", 399, 7, "draft", 60, "Named support engineers with a shared escalation channel."],
  ["Event Streaming", "NX-INT-021", "Integrations", 209, 41, "active", 50, "Stream workspace events into external data platforms."],
  ["Query Builder", "NX-ANL-022", "Analytics", 89, 3, "active", 40, "Explore product data with a governed visual query builder."],
  ["Approval Flows", "NX-AUT-023", "Automation", 129, 27, "draft", 30, "Configurable approval chains for sensitive operations."],
  ["Fleet Monitoring", "NX-OPS-024", "Operations", 179, 55, "active", 20, "Operational telemetry and health monitoring for distributed fleets."],
]);

const CUSTOMER_SEEDS = Object.freeze([
  ["Maya Chen", "maya.chen@example.com"],
  ["Liam Bennett", "liam.bennett@example.com"],
  ["Sofia Alvarez", "sofia.alvarez@example.com"],
  ["Noah Williams", "noah.williams@example.com"],
  ["Elena Rossi", "elena.rossi@example.com"],
  ["Marcus Reed", "marcus.reed@example.com"],
  ["Hana Kim", "hana.kim@example.com"],
  ["Oliver Grant", "oliver.grant@example.com"],
  ["Zara Ahmed", "zara.ahmed@example.com"],
  ["Mateo Rossi", "mateo.rossi@example.com"],
  ["Chloe Martin", "chloe.martin@example.com"],
  ["Daniel Wu", "daniel.wu@example.com"],
]);

const ORDER_STATUS_SEQUENCE = Object.freeze([
  "delivered",
  "processing",
  "pending",
  "delivered",
  "cancelled",
  "shipped",
  "processing",
  "delivered",
  "pending",
  "delivered",
  "processing",
  "delivered",
  "shipped",
  "cancelled",
  "delivered",
  "processing",
  "pending",
  "delivered",
  "processing",
  "delivered",
  "shipped",
  "delivered",
  "cancelled",
  "delivered",
  "processing",
  "pending",
  "delivered",
  "shipped",
  "cancelled",
  "delivered",
]);

const ORDER_PAYMENT_SEQUENCE = Object.freeze([
  "paid",
  "paid",
  "pending",
  "paid",
  "refunded",
  "paid",
  "pending",
  "paid",
  "pending",
  "refunded",
  "paid",
  "paid",
  "paid",
  "refunded",
  "paid",
  "pending",
  "pending",
  "paid",
  "paid",
  "paid",
  "paid",
  "paid",
  "refunded",
  "paid",
  "pending",
  "pending",
  "paid",
  "paid",
  "refunded",
  "paid",
]);

const SHIPPING_LOCATIONS = Object.freeze([
  { city: "San Francisco", state: "CA", postalCode: "94107", country: "United States" },
  { city: "Austin", state: "TX", postalCode: "78701", country: "United States" },
  { city: "New York", state: "NY", postalCode: "10001", country: "United States" },
  { city: "Seattle", state: "WA", postalCode: "98101", country: "United States" },
  { city: "Chicago", state: "IL", postalCode: "60601", country: "United States" },
  { city: "Denver", state: "CO", postalCode: "80202", country: "United States" },
]);

let users = [];
let products = [];
let orders = [];
let nextUserSequence = 25;
let nextProductSequence = 25;

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function normalizeEmail(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function buildUsers(now) {
  return USER_SEEDS.map(
    ([name, email, role, status, createdDaysAgo, lastActiveHoursAgo, department], index) => ({
      id: `user-${String(index + 1).padStart(3, "0")}`,
      name,
      email,
      role,
      status,
      avatar: null,
      phone: `+1 (415) 555-${String(1200 + index * 7).padStart(4, "0")}`,
      department,
      createdAt: subDays(now, createdDaysAgo).toISOString(),
      lastActiveAt: subHours(now, lastActiveHoursAgo).toISOString(),
    }),
  );
}

function buildProducts(now) {
  return PRODUCT_SEEDS.map(
    ([name, sku, category, price, stock, status, createdDaysAgo, description], index) => ({
      id: `product-${String(index + 1).padStart(3, "0")}`,
      name,
      sku,
      category,
      description,
      price,
      stock,
      status,
      imageUrl: null,
      createdAt: subDays(now, createdDaysAgo).toISOString(),
    }),
  );
}

function buildOrders(now, seedProducts) {
  return ORDER_STATUS_SEQUENCE.map((status, index) => {
    const customer = CUSTOMER_SEEDS[index % CUSTOMER_SEEDS.length];
    const location = SHIPPING_LOCATIONS[index % SHIPPING_LOCATIONS.length];
    const itemCount = 1 + ((index * 2) % 3);
    const items = Array.from({ length: itemCount }, (_, itemIndex) => {
      const product =
        seedProducts[(index * 3 + itemIndex * 5) % seedProducts.length];
      const quantity = 1 + ((index + itemIndex) % 3);
      const lineTotal = roundCurrency(product.price * quantity);

      return {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        unitPrice: product.price,
        quantity,
        lineTotal,
      };
    });
    const subtotal = roundCurrency(
      items.reduce((total, item) => total + item.lineTotal, 0),
    );
    const discount =
      index % 6 === 0
        ? roundCurrency(subtotal * 0.1)
        : index % 4 === 0
          ? roundCurrency(subtotal * 0.05)
          : 0;
    const createdAt = subHours(now, 4 + index * 26);

    return {
      id: `ORD-${1001 + index}`,
      customer: {
        name: customer[0],
        email: customer[1],
        phone: `+1 (628) 555-${String(3100 + index * 3).padStart(4, "0")}`,
      },
      date: createdAt.toISOString(),
      status,
      paymentStatus: ORDER_PAYMENT_SEQUENCE[index],
      paymentMethod: PAYMENT_METHODS[index % PAYMENT_METHODS.length],
      items,
      subtotal,
      discount,
      total: roundCurrency(subtotal - discount),
      shipping: {
        name: customer[0],
        line1: `${1200 + index * 11} Market Street`,
        city: location.city,
        state: location.state,
        postalCode: location.postalCode,
        country: location.country,
      },
    };
  });
}

export function resetManagementData() {
  const now = new Date();

  users = buildUsers(now);
  products = buildProducts(now);
  orders = buildOrders(now, products);
  nextUserSequence = 25;
  nextProductSequence = 25;
}

export function getUsers() {
  return users;
}

export function getProducts() {
  return products;
}

export function getOrders() {
  return orders;
}

export function findUserById(id) {
  return users.find((user) => user.id === id) ?? null;
}

export function findProductById(id) {
  return products.find((product) => product.id === id) ?? null;
}

export function findOrderById(id) {
  return orders.find((order) => order.id === id) ?? null;
}

export function findUserByEmail(email, excludeId = null) {
  const normalizedEmail = normalizeEmail(email);

  return (
    users.find(
      (user) =>
        user.id !== excludeId && normalizeEmail(user.email) === normalizedEmail,
    ) ?? null
  );
}

export function findProductBySku(sku, excludeId = null) {
  const normalizedSku = String(sku ?? "").trim().toUpperCase();

  return (
    products.find(
      (product) =>
        product.id !== excludeId &&
        String(product.sku).toUpperCase() === normalizedSku,
    ) ?? null
  );
}

export function createUserRecord(input) {
  const user = {
    id: `user-${String(nextUserSequence).padStart(3, "0")}`,
    name: input.name,
    email: normalizeEmail(input.email),
    role: input.role,
    status: input.status,
    avatar: null,
    phone: input.phone ?? null,
    department: input.department ?? null,
    createdAt: new Date().toISOString(),
    lastActiveAt:
      input.status === "active" ? new Date().toISOString() : null,
  };

  nextUserSequence += 1;
  users = [user, ...users];

  return user;
}

export function updateUserRecord(id, changes) {
  users = users.map((user) =>
    user.id === id
      ? {
          ...user,
          ...changes,
          email: changes.email ? normalizeEmail(changes.email) : user.email,
        }
      : user,
  );

  return findUserById(id);
}

export function deleteUserRecord(id) {
  const existing = findUserById(id);

  if (!existing) {
    return false;
  }

  users = users.filter((user) => user.id !== id);

  return true;
}

export function createProductRecord(input) {
  const product = {
    id: `product-${String(nextProductSequence).padStart(3, "0")}`,
    name: input.name,
    sku: input.sku,
    category: input.category,
    description: input.description ?? null,
    price: input.price,
    stock: input.stock,
    status: input.status,
    imageUrl: input.imageUrl ?? null,
    createdAt: new Date().toISOString(),
  };

  nextProductSequence += 1;
  products = [product, ...products];

  return product;
}

export function updateProductRecord(id, changes) {
  products = products.map((product) =>
    product.id === id
      ? {
          ...product,
          ...changes,
          sku: changes.sku
            ? String(changes.sku).trim().toUpperCase()
            : product.sku,
        }
      : product,
  );

  return findProductById(id);
}

export function deleteProductRecord(id) {
  const existing = findProductById(id);

  if (!existing) {
    return false;
  }

  products = products.filter((product) => product.id !== id);

  return true;
}

export function updateOrderStatusRecord(id, status) {
  orders = orders.map((order) =>
    order.id === id
      ? {
          ...order,
          status,
          updatedAt: new Date().toISOString(),
        }
      : order,
  );

  return findOrderById(id);
}

export function buildUsersSummary() {
  return {
    total: users.length,
    active: users.filter((user) => user.status === "active").length,
    inactive: users.filter((user) => user.status === "inactive").length,
    administrators: users.filter((user) => user.role === ROLES.ADMIN).length,
  };
}

export function buildProductsSummary() {
  return {
    total: products.length,
    active: products.filter((product) => product.status === "active").length,
    draft: products.filter((product) => product.status === "draft").length,
    inactive: products.filter((product) => product.status === "inactive").length,
    lowStock: products.filter(
      (product) => product.stock <= LOW_STOCK_THRESHOLD,
    ).length,
  };
}

export function buildOrdersSummary() {
  const countByStatus = (status) =>
    orders.filter((order) => order.status === status).length;

  return {
    total: orders.length,
    pending: countByStatus("pending"),
    processing: countByStatus("processing"),
    shipped: countByStatus("shipped"),
    delivered: countByStatus("delivered"),
    completed: countByStatus("delivered"),
    cancelled: countByStatus("cancelled"),
  };
}

resetManagementData();
