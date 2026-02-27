import {
  AlarmClock,
  Ban,
  CheckCircle,
  Circle,
  CircleOff,
  Clock,
  FileText,
  Send,
} from "lucide-react";

import {
  BusinessAdditionalContactType,
  BusinessAuthorizationType,
  BusinessContactType,
  BusinessDeliveryType,
  BusinessDetailsType,
  CustomerFormType,
} from "../form-schema/customer-schema";

export const businessDetails: BusinessDetailsType = {
  companyName: "",
  companyType: "",
  companyDBA: "",
  companyEin: "",
  companyStreet: "",
  companyCity: "",
  companyState: "",
  companyZip: "",
  companyPhone: "",
  companyEmail: "",
};

export const businessContacts: BusinessContactType = {
  officerFirst: "",
  officerLast: "",
  officerRole: "",
  officerMobile: "",
  officerEmail: "",
  officerStreet: "",
  officerCity: "",
  officerState: "",
  officerZip: "",
};

export const businessAdditionalContact: BusinessAdditionalContactType = {
  orderingName: "",
  orderingPhone: "",
  accountPayableEmail: "",
  guarantorName: "",
  guarantorRole: "",
  salesRepresentative: "",
};

export const businessDelivery: BusinessDeliveryType = {
  lockboxPermission: "",
  deliverySchedule: [
    {
      day: "",
      window: "",
      receivingName: "",
      receivingPhone: "",
      instructions: "",
    },
  ],
};

export const businessAuthorization: BusinessAuthorizationType = {
  certificate: null as any,
  dlFront: null as any,
  dlBack: null as any,
  signature: null as any,
  signatureName: "",
  acknowledge: false,
};

export const defaultValues: CustomerFormType = {
  step: 0,
  ...businessDetails,
  ...businessContacts,
  ...businessAdditionalContact,
  ...businessContacts,
  ...businessDelivery,
  ...businessAuthorization,
};

/**
 * constants
 */
export const BUSINESS_TYPES = [
  "Restaurant",
  "Retail",
  "Health Care",
  "Education",
  "Food Truck",
  "Other",
];

export const ROLES = [
  "Owner",
  "Management",
  "Chef / Culinary / Accounting",
  "Marketing",
  "CEO",
  "CFO",
  "VP",
  "Other",
];
export const SALES_REPRESENTATIVE = [
  "Elizabeth",
  "Jorge",
  "Yhessenia",
  "Other",
];

export const DELIVERY_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DELIVERY_TIME = [
  "6:00 AM – 9:00 AM",
  "9:00 AM – 12:00 PM",
  "12:00 PM – 3:00 PM",
  "3:00 PM – 6:00 PM",
  "6:00 PM – 9:00 PM",
  "Anytime",
];

export const statusMap = {
  new: {
    label: "New",
    color: "#F59E0B",
    icon: Circle,
    actions: [
      {
        label: "Approve Application",
        action: "active",
        icon: CheckCircle,
      },
      {
        label: "Put On Hold",
        action: "on_hold",
        icon: AlarmClock,
      },
      {
        label: "Reject Application",
        action: "rejected",
        icon: CircleOff,
      },
    ],
  },
  active: {
    label: "Approved",
    color: "#22C55E",
    icon: CheckCircle,
    actions: [],
  },
  rejected: {
    label: "Rejected",
    color: "#EF4444",
    icon: CircleOff,
    actions: [
      {
        label: "Move to Review",
        action: "new",
        icon: CheckCircle,
      },
    ],
  },
  on_hold: {
    label: "On Hold",
    color: "#3B82F6",
    icon: Clock,
    actions: [
      {
        label: "Approve Application",
        action: "active",
        icon: CheckCircle,
      },
      {
        label: "Reject Application",
        action: "rejected",
        icon: CircleOff,
      },
    ],
  },
} as const;

export const inviteStatusMap = {
  invited: {
    label: "Invited",
    color: "#F59E0B",
    icon: Send,
    query: { status: "invited" },
    actions: [
      {
        label: "Mark as Converted",
        action: "converted",
        icon: CheckCircle,
      },
    ],
  },
  applied: {
    label: "Applied",
    color: "#3B82F6",
    icon: FileText,
    actions: [
      {
        label: "Send Invitation",
        action: "invited",
        icon: Send,
      },
      {
        label: "Reject Application",
        action: "rejected",
        icon: Ban,
      },
    ],
  },
  converted: {
    label: "Approved",
    color: "#22C55E",
    icon: CheckCircle,
    actions: [],
  },
  rejected: {
    label: "Rejected",
    color: "#EF4444",
    icon: CircleOff,
    actions: [],
  },
} as const;

export const CUSTOMER_REJECT_OPTIONS = [
  "Incomplete application",
  "Invalid information",
  "Eligibility not met",
  "Policy violation",
  "Duplicate application",
  "Incorrect details",
  "Documents unclear",
  "Requires correction",
  "Verification failed",
];

export const CUSTOMER_STATUS_DIALOG_CONFIG = {
  reject: {
    title: "Reject Application",
    description: "Please provide a reason for rejecting this application.",
    submitLabel: "Reject Application",
    successMessage: "Application has been rejected!",
    status: "rejected",
  },
  hold: {
    title: "Hold Application",
    description:
      "Provide a reason for holding this application. The applicant will be notified.",
    submitLabel: "Put on Hold",
    successMessage: "Application has been placed on hold.",
    status: "on_hold",
  },
};
