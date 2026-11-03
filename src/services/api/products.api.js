import { ENDPOINTS } from "./endpoints";
import {
  createResource,
  deleteResource,
  getResource,
  updateResource,
} from "./resource";

export function getProducts(params) {
  return getResource(
    ENDPOINTS.products.list,
    params,
    "Unable to load products.",
  );
}

export function getProduct(id) {
  return getResource(
    ENDPOINTS.products.detail(id),
    undefined,
    "Unable to load this product.",
  );
}

export function createProduct(payload) {
  return createResource(
    ENDPOINTS.products.list,
    payload,
    "Unable to create this product.",
  );
}

export function updateProduct(id, payload) {
  return updateResource(
    ENDPOINTS.products.detail(id),
    payload,
    "Unable to update this product.",
  );
}

export function updateProductStatus(id, status) {
  return updateResource(
    ENDPOINTS.products.status(id),
    { status },
    "Unable to update this product's status.",
  );
}

export function deleteProduct(id) {
  return deleteResource(
    ENDPOINTS.products.detail(id),
    "Unable to delete this product.",
  );
}
