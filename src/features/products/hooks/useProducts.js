import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  updateProductStatus,
} from "@/services/api/products.api";
import { queryKeys } from "@/services/api/queryKeys";

const LIST_STALE_TIME = 30 * 1000;
const DETAIL_STALE_TIME = 60 * 1000;

function invalidateProducts(queryClient) {
  return queryClient.invalidateQueries({
    queryKey: queryKeys.products.all,
  });
}

export function useProducts(filters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => getProducts(filters),
    staleTime: LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (product) => {
      queryClient.setQueryData(
        queryKeys.products.detail(product.id),
        product,
      );
      invalidateProducts(queryClient);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }) => updateProduct(id, values),
    onSuccess: (product) => {
      queryClient.setQueryData(
        queryKeys.products.detail(product.id),
        product,
      );
      invalidateProducts(queryClient);
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateProductStatus(id, status),
    onSuccess: (product) => {
      queryClient.setQueryData(
        queryKeys.products.detail(product.id),
        product,
      );
      invalidateProducts(queryClient);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_result, id) => {
      queryClient.removeQueries({
        queryKey: queryKeys.products.detail(id),
      });
      invalidateProducts(queryClient);
    },
  });
}
