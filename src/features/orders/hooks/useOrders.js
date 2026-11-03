import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getOrder,
  getOrders,
  updateOrderStatus,
} from "@/services/api/orders.api";
import { queryKeys } from "@/services/api/queryKeys";

const LIST_STALE_TIME = 30 * 1000;
const DETAIL_STALE_TIME = 60 * 1000;

function invalidateOrders(queryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
}

export function useOrders(filters) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => getOrders(filters),
    staleTime: LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.orders.detail(order.id), order);
      invalidateOrders(queryClient);
    },
  });
}
