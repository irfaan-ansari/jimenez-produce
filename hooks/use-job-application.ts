import {
  createJobApplication,
  createJobPost,
  deleteJobApplication,
  deleteJobPost,
  updateJobApplication,
  updateJobPost,
} from "@/server/job";
import { fetcher } from "@/lib/helper/fetcher";
import {
  JobApplicationInsertType,
  JobApplicationSelectType,
  JobPostInsertType,
  JobPostSelectType,
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

type JobPostResponse = {
  data: JobPostSelectType[];
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

export const useJobPosts = (query: string) => {
  return useQuery({
    queryKey: ["job-posts", query],
    queryFn: () => fetcher<JobPostResponse>(`/api/job-posts?${query}`),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateJobPost = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createJobPost,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["job-posts"],
      });
      client.invalidateQueries({
        queryKey: ["status-count"],
      });
    },
  });
};

export const useUpdateJobPost = () => {
  const client = useQueryClient();
  return useMutation<JobMutateResponse, Error, Partial<JobPostInsertType>>({
    mutationFn: ({ id, ...rest }) => updateJobPost(id!, rest),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["job-posts"],
      });
      client.invalidateQueries({
        queryKey: ["status-count"],
      });
    },
  });
};

export const useDeleteJobPost = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteJobPost,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["job-posts"],
      });
      client.invalidateQueries({
        queryKey: ["status-count"],
      });
    },
  });
};
