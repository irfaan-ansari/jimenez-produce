import { BusinessDetails } from "@/components/customer-form/business-details";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from "../form-schema/customer-schema";
import { BusinessContact } from "@/components/customer-form/business-contact";
import { BusinessAdditionalContact } from "@/components/customer-form/additional-contact";
import { BusinessDelivery } from "@/components/customer-form/business-delivery";
import { Authorization } from "@/components/customer-form/business-authorization";
import z from "zod";
import {
  Building2,
  FileText,
  Truck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

type StepConfig = {
  title: string;
  description: string;
  component: React.ComponentType<any>;
  schema: z.ZodObject<any>;
  icon: LucideIcon;
};

export const steps: StepConfig[] = [
  {
    title: "title1",
    description: "desc1",
    icon: Building2,
    component: BusinessDetails,
    schema: step1Schema,
  },
  {
    title: "title2",
    description: "desc2",
    component: BusinessContact,
    schema: step2Schema,
    icon: UserRound,
  },
  {
    title: "title3",
    description: "desc3",
    component: BusinessAdditionalContact,
    schema: step3Schema,
    icon: Users,
  },
  {
    title: "title4",
    description: "desc4",
    component: BusinessDelivery,
    schema: step4Schema,
    icon: Truck,
  },
  {
    title: "title5",
    description: "desc5",
    component: Authorization,
    schema: step5Schema,
    icon: FileText,
  },
];
