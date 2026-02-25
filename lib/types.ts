import { inviteStatusMap, statusMap } from "./constants/customer";
import { jobApplicationStatusMap } from "./constants/job";

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
