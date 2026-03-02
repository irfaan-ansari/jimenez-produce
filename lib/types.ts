import { inviteStatusMap, statusMap } from "./constants/customer";
import { jobApplicationStatusMap } from "./constants/job";
import { ProductSelectType } from "./db/schema";

export type JobApplicationStatus = keyof typeof jobApplicationStatusMap;

export interface EmailTemplateConfig {
  subject: string;
  to: string[] | [];
  template: React.ComponentType<any>;
}

export type CustomerInviteStatus = keyof typeof inviteStatusMap;
export type CustomerApplicationStatus =
  | keyof typeof statusMap
  | CustomerInviteStatus;

type ActionSuccess<T> = {
  success: true;
  data: T;
  error: null;
};

type ActionError = {
  success: false;
  data: null;
  error: {
    message: string;
  };
};

export type ActionResult<T> = ActionSuccess<T> | ActionError;

export type ProductResponse = {
  data: ProductSelectType[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
};
