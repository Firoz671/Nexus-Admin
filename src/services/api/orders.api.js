import { ENDPOINTS } from "./endpoints";
import { getResource, updateResource } from "./resource";

export function getOrders(params) {
  return getResource(
    ENDPOINTS.orders.list,
    params,
    "Unable to load orders.",
  );
}

export function getOrder(id) {
  return getResource(
    ENDPOINTS.orders.detail(id),
    undefined,
    "Unable to load this order.",
  );
}

export function updateOrderStatus(id, status) {
  return updateResource(
    ENDPOINTS.orders.status(id),
    { status },
    "Unable to update this order's status.",
  );
}
