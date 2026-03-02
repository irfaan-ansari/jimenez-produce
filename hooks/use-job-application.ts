import { fetcher } from "@/lib/helper/fetcher";
import { useQuery } from "@tanstack/react-query";
import { JobApplicationSelectType } from "@/lib/db/schema";

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
