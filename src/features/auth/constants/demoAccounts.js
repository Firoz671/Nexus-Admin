import { ROLES } from "@/constants/permissions";

export const DEMO_ACCOUNTS = Object.freeze([
  Object.freeze({
    id: "user-001",
    name: "Alex Morgan",
    email: "admin@nexus.test",
    password: "Admin123!",
    role: ROLES.ADMIN,
    avatar: null,
  }),
  Object.freeze({
    id: "user-002",
    name: "Jordan Lee",
    email: "manager@nexus.test",
    password: "Manager123!",
    role: ROLES.MANAGER,
    avatar: null,
  }),
]);
