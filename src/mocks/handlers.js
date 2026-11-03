import { delay, http } from "msw";
import {
  buildAnalyticsOverview,
  buildDashboardSummary,
  buildRecentActivities,
  buildRecentTransactions,
  buildRevenueSeries,
  buildSalesSummary,
  buildUserGrowth,
} from "./data/analytics";
import {
  findAccountByCredentials,
  findAccountByToken,
  getMockSession,
  toPublicUser,
} from "./data/users";
import { managementHandlers } from "./managementHandlers";
import {
  errorResponse,
  getAuthenticatedAccount,
  getBearerToken,
  MOCK_DELAY,
  successResponse,
} from "./http";
import { resolveDateRangeParams } from "@/utils/dateRange";

const LOGIN_PATH = /\/auth\/login\/?$/;
const CURRENT_USER_PATH = /\/auth\/me\/?$/;
const LOGOUT_PATH = /\/auth\/logout\/?$/;
const DASHBOARD_SUMMARY_PATH = /\/dashboard\/summary\/?$/;
const DASHBOARD_REVENUE_PATH = /\/dashboard\/revenue\/?$/;
const DASHBOARD_SALES_PATH = /\/dashboard\/sales\/?$/;
const DASHBOARD_USER_GROWTH_PATH = /\/dashboard\/user-growth\/?$/;
const DASHBOARD_TRANSACTIONS_PATH = /\/dashboard\/transactions\/?$/;
const DASHBOARD_ACTIVITIES_PATH = /\/dashboard\/activities\/?$/;
const ANALYTICS_OVERVIEW_PATH = /\/analytics\/overview\/?$/;

function resolveRequestDateRange(request) {
  try {
    const url = new URL(request.url);

    return {
      range: resolveDateRangeParams(url.searchParams),
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

function createDataEndpoint(path, message, buildResponse) {
  return http.get(path, async ({ request }) => {
    await delay(MOCK_DELAY);

    if (!getAuthenticatedAccount(request)) {
      return errorResponse(401, "Authentication is required.");
    }

    const dateRange = resolveRequestDateRange(request);

    if (dateRange.error) {
      return errorResponse(400, dateRange.error);
    }

    return successResponse(message, buildResponse(dateRange.range));
  });
}

export const handlers = [
  http.post(LOGIN_PATH, async ({ request }) => {
    await delay(MOCK_DELAY);

    let credentials;

    try {
      credentials = await request.json();
    } catch {
      return errorResponse(400, "The request body could not be read.");
    }

    const email =
      typeof credentials?.email === "string" ? credentials.email.trim() : "";
    const password =
      typeof credentials?.password === "string" ? credentials.password : "";

    if (!email || !password) {
      return errorResponse(400, "Email and password are required.");
    }

    const account = findAccountByCredentials(email, password);

    if (!account) {
      return errorResponse(401, "Invalid email or password.");
    }

    return successResponse("Login successful", getMockSession(account));
  }),

  http.get(CURRENT_USER_PATH, async ({ request }) => {
    await delay(MOCK_DELAY);

    const token = getBearerToken(request);

    if (!token) {
      return errorResponse(401, "Authentication is required.");
    }

    const account = findAccountByToken(token);

    if (!account) {
      return errorResponse(
        401,
        "Your session is invalid or has expired. Please sign in again.",
      );
    }

    return successResponse("Current user retrieved", {
      user: toPublicUser(account),
    });
  }),

  http.post(LOGOUT_PATH, async () => {
    await delay(MOCK_DELAY);

    return successResponse("Logout successful", null);
  }),

  createDataEndpoint(
    DASHBOARD_SUMMARY_PATH,
    "Dashboard summary retrieved",
    buildDashboardSummary,
  ),
  createDataEndpoint(
    DASHBOARD_REVENUE_PATH,
    "Revenue analytics retrieved",
    buildRevenueSeries,
  ),
  createDataEndpoint(
    DASHBOARD_SALES_PATH,
    "Sales overview retrieved",
    buildSalesSummary,
  ),
  createDataEndpoint(
    DASHBOARD_USER_GROWTH_PATH,
    "User growth retrieved",
    buildUserGrowth,
  ),
  createDataEndpoint(
    DASHBOARD_TRANSACTIONS_PATH,
    "Recent transactions retrieved",
    buildRecentTransactions,
  ),
  createDataEndpoint(
    DASHBOARD_ACTIVITIES_PATH,
    "Recent activity retrieved",
    buildRecentActivities,
  ),
  createDataEndpoint(
    ANALYTICS_OVERVIEW_PATH,
    "Analytics overview retrieved",
    buildAnalyticsOverview,
  ),
  ...managementHandlers,
];
