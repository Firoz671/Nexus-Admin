import { DEMO_ACCOUNTS } from "@/features/auth/constants/demoAccounts";

const TOKENS_BY_EMAIL = Object.freeze({
  "admin@nexus.test": "mock-access-token-user-001",
  "manager@nexus.test": "mock-access-token-user-002",
});

export const MOCK_ACCOUNTS = Object.freeze(
  DEMO_ACCOUNTS.map((account) =>
    Object.freeze({
      ...account,
      token: TOKENS_BY_EMAIL[account.email],
    }),
  ),
);

export function toPublicUser(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    avatar: account.avatar,
  };
}

export function findAccountByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();

  return (
    MOCK_ACCOUNTS.find((account) => account.email === normalizedEmail) ?? null
  );
}

export function findAccountByCredentials(email, password) {
  const account = findAccountByEmail(email);

  if (!account || account.password !== password) {
    return null;
  }

  return account;
}

export function findAccountByToken(token) {
  return MOCK_ACCOUNTS.find((account) => account.token === token) ?? null;
}

export function getMockSession(account) {
  return {
    accessToken: account.token,
    user: toPublicUser(account),
  };
}

const adminAccount = findAccountByEmail("admin@nexus.test");
const managerAccount = findAccountByEmail("manager@nexus.test");

export const DEMO_SESSIONS = Object.freeze({
  admin: Object.freeze(getMockSession(adminAccount)),
  manager: Object.freeze(getMockSession(managerAccount)),
});
