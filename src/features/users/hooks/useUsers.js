import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserStatus,
} from "@/services/api/users.api";
import { queryKeys } from "@/services/api/queryKeys";
import { useAuthStore } from "@/store/authStore";

const LIST_STALE_TIME = 30 * 1000;
const DETAIL_STALE_TIME = 60 * 1000;

function invalidateUsers(queryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
}

export function useUsers(filters) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => getUsers(filters),
    staleTime: LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUser(id),
    enabled: Boolean(id),
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.detail(user.id), user);
      invalidateUsers(queryClient);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }) => updateUser(id, values),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.detail(user.id), user);
      invalidateUsers(queryClient);

      const authState = useAuthStore.getState();

      if (authState.user?.id === user.id) {
        useAuthStore.setState({
          user: {
            ...authState.user,
            name: user.name,
            avatar: user.avatar ?? authState.user.avatar,
          },
        });
      }
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateUserStatus(id, status),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.detail(user.id), user);
      invalidateUsers(queryClient);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(id) });
      invalidateUsers(queryClient);
    },
  });
}
