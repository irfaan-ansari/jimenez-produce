import {
  createJobApplication,
  deleteJobApplication,
  updateJobApplication,
} from "@/server/job";
import { fetcher } from "@/lib/helper/fetcher";
import {
  JobApplicationInsertType,
  JobApplicationSelectType,
} from "@/lib/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type JobMutateResponse = {
  id: number;
};
type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type JobApplicationResponse = {
  data: JobApplicationSelectType[];
  pagination: Pagination;
};

export const useJobApplications = (query: string) => {
  return useQuery({
    queryKey: ["job-applications", query],
    queryFn: () =>
      fetcher<JobApplicationResponse>(`/api/job-applications?${query}`),

    staleTime: 1000 * 60 * 5,
  });
};

export const useJobApplication = (id: number) => {
  return useQuery({
    queryKey: ["job-application", id],
    queryFn: () =>
      fetcher<{ data: JobApplicationSelectType }>(
        `/api/job-applications/${id}`
      ),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateJobApplication = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createJobApplication,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["job-applications"],
      });
    },
  });
};

export const useUpdateJobApplication = () => {
  const client = useQueryClient();
  return useMutation<
    JobMutateResponse,
    Error,
    Partial<JobApplicationInsertType>
  >({
    mutationFn: ({ id, ...rest }) => updateJobApplication(id!, rest),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["job-applications"],
      });
      client.invalidateQueries({
        queryKey: ["status-count"],
      });
    },
  });
};
export const useDeleteJobApplication = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteJobApplication,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["job-applications"],
      });
      client.invalidateQueries({
        queryKey: ["status-count"],
      });
    },
  });
};
