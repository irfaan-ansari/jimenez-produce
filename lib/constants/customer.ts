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
  step: 4,
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
        label: "Review",
        action: "under_review",
        icon: CheckCircle,
      },
      {
        label: "Approve",
        action: "active",
        icon: CheckCircle,
      },
      {
        label: "Put On Hold",
        action: "on_hold",
        icon: AlarmClock,
      },
      {
        label: "Reject",
        action: "rejected",
        icon: CircleOff,
      },
    ],
  },
  under_review: {
    label: "Under Review",
    color: "#22C55E",
    icon: CheckCircle,
    actions: [
      {
        label: "Approve",
        action: "active",
        icon: CheckCircle,
      },
      {
        label: "Put On Hold",
        action: "on_hold",
        icon: AlarmClock,
      },
      {
        label: "Reject",
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
        action: "under_review",
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
        label: "Approve",
        action: "active",
        icon: CheckCircle,
      },
      {
        label: "Reject",
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
    actions: [
      {
        label: "Mark as Approved",
        action: "approved",
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
        label: "Mark as Approved",
        action: "approved",
        icon: CheckCircle,
      },
    ],
  },
  approved: {
    label: "Approved",
    color: "#22C55E",
    icon: CheckCircle,
    actions: [
      {
        label: "Revoke",
        action: "revoked",
        icon: Ban,
      },
    ],
  },
  new: {
    label: "New",
    color: "#F59E0B",
    icon: Circle,
    actions: [
      {
        label: "Approve",
        action: "approved",
        icon: CheckCircle,
      },
      {
        label: "Reject",
        action: "rejected",
        icon: CircleOff,
      },
    ],
  },
  rejected: {
    label: "Rejected",
    color: "#EF4444",
    icon: CircleOff,
    actions: [
      {
        label: "Move to New",
        action: "new",
        icon: Circle,
      },
    ],
  },
  revoked: {
    label: "Revoked",
    color: "#71717A",
    icon: Ban,
    actions: [
      {
        label: "Move to New",
        action: "new",
        icon: Circle,
      },
    ],
  },
} as const;
