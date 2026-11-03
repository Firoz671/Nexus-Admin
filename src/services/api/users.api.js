import { ENDPOINTS } from "./endpoints";
import {
  createResource,
  deleteResource,
  getResource,
  updateResource,
} from "./resource";

export function getUsers(params) {
  return getResource(
    ENDPOINTS.users.list,
    params,
    "Unable to load users.",
  );
}

export function getUser(id) {
  return getResource(
    ENDPOINTS.users.detail(id),
    undefined,
    "Unable to load this user.",
  );
}

export function createUser(payload) {
  return createResource(
    ENDPOINTS.users.list,
    payload,
    "Unable to create this user.",
  );
}

export function updateUser(id, payload) {
  return updateResource(
    ENDPOINTS.users.detail(id),
    payload,
    "Unable to update this user.",
  );
}

export function updateUserStatus(id, status) {
  return updateResource(
    ENDPOINTS.users.status(id),
    { status },
    "Unable to update this user's status.",
  );
}

export function deleteUser(id) {
  return deleteResource(
    ENDPOINTS.users.detail(id),
    "Unable to delete this user.",
  );
}
