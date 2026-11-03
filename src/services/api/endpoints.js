export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const ENDPOINTS = Object.freeze({
  auth: Object.freeze({
    login: "/auth/login",
    me: "/auth/me",
    logout: "/auth/logout",
  }),
  dashboard: Object.freeze({
    summary: "/dashboard/summary",
    revenue: "/dashboard/revenue",
    sales: "/dashboard/sales",
    userGrowth: "/dashboard/user-growth",
    transactions: "/dashboard/transactions",
    activities: "/dashboard/activities",
  }),
  analytics: Object.freeze({
    overview: "/analytics/overview",
  }),
  users: Object.freeze({
    list: "/users",
    detail: (id) => `/users/${encodeURIComponent(id)}`,
    status: (id) => `/users/${encodeURIComponent(id)}/status`,
  }),
  products: Object.freeze({
    list: "/products",
    detail: (id) => `/products/${encodeURIComponent(id)}`,
    status: (id) => `/products/${encodeURIComponent(id)}/status`,
  }),
  orders: Object.freeze({
    list: "/orders",
    detail: (id) => `/orders/${encodeURIComponent(id)}`,
    status: (id) => `/orders/${encodeURIComponent(id)}/status`,
  }),
});
