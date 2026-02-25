import {
  type CustomerSelectType,
  type CustomerInsertType,
  CustomerInviteInsertType,
  CustomerInviteSelectType,
} from "@/lib/db/schema";
import {
  createCustomer,
  createInvite,
  deleteCustomer,
  deleteInvite,
  updateCustomer,
  updateInvite,
} from "@/server/customer";
import { fetcher } from "@/lib/helper/fetcher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type CustomerMutateResponse = {
  id: number;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
type CustomerResponse = {
  data: CustomerSelectType[];
  pagination: Pagination;
};

type CustomerInviteResponse = {
  data: CustomerInviteSelectType[];
  pagination: Pagination;
};

export const useCustomers = (query?: string) => {
  return useQuery({
    queryKey: ["customers", query],
    queryFn: () => {
      return fetcher<CustomerResponse>(`/api/customers?${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCustomer = (id: string | number) => {
  return useQuery<{ data: CustomerSelectType }>({
    queryKey: ["customer", id],
    queryFn: () => fetcher(`/api/customers/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CustomerMutateResponse,
    Error,
    Partial<CustomerInsertType>
  >({
    mutationFn: ({ id, ...rest }) => updateCustomer(id!, rest),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<CustomerMutateResponse, Error, number>({
    mutationFn: (id) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};

export const useInvites = (query?: string) => {
  return useQuery({
    queryKey: ["invites", query],
    queryFn: () => {
      return fetcher<CustomerInviteResponse>(`/api/invites?${query}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invites"],
      });
    },
  });
};

export const useUpdateInvite = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CustomerMutateResponse,
    Error,
    Partial<CustomerInviteInsertType>
  >({
    mutationFn: ({ id, ...rest }) => updateInvite(id!, rest),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invites"],
      });
    },
  });
};

export const useDeleteInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invites"],
      });
    },
  });
};
