import {
  CheckCircle,
  Circle,
  Clock,
  FileEdit,
  MessageCircle,
  XCircle,
} from "lucide-react";
import {
  ApplicantAccidentHistoryType,
  ApplicantAddressType,
  ApplicantAuthorizationType,
  ApplicantDetailsType,
  ApplicantDrivingExperienceType,
  ApplicantEducationType,
  ApplicantEmployementType,
  ApplicantLicenseType,
} from "../form-schema/job-schema";

export const applicantDetail: ApplicantDetailsType = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dob: "",
  socialSecurity: "",
  availableStartDate: "",
  hasLegalRights: "yes",
  location: "",
};
export const applicantAddress: ApplicantAddressType = {
  currentAddress: {
    street: "",
    city: "",
    state: "",
    zip: "",
    yearsAtAddress: "",
  },
  mailingAddress: {
    street: "",
    city: "",
    state: "",
    zip: "",
    yearsAtAddress: "",
  },
  addresses: [],
};
export const applicantLicence: ApplicantLicenseType = {
  currentLicense: {
    state: "",
    licenseType: "",
    licenseNumber: "",
    endorsements: "",
    expiryDate: "",
  },
  licenses: [],
};

export const applicantExperience: ApplicantEmployementType = {
  experience: [
    {
      employerName: "",
      phone: "",
      address: "",
      position: "",
      fromDate: "",
      toDate: "",
      reasonForLeaving: "",
      safetySensitive: "",
      subjectToFmcsa: "",
      gap: "",
      salary: "",
    },
  ],
};
export const applicantEducation: ApplicantEducationType = {
  highSchool: {
    institutionName: "",
    fieldOfStudy: "",
    location: "",
    yearCompleted: "",
    details: "",
  },
  collage: {
    institutionName: "",
    fieldOfStudy: "",
    location: "",
    yearCompleted: "",
    details: "",
  },
  educations: [
    {
      institutionName: "",
      fieldOfStudy: "",
      location: "",
      yearCompleted: "",
      details: "",
    },
  ],
};

export const applicantConfirmation: ApplicantAuthorizationType = {
  applicantName: "",
  declaration: false,
  drivingLicenseBack: undefined as any,
  drivingLicenseFront: undefined as any,
  socialSecurityBack: undefined as any,
  socialSecurityFront: undefined as any,
  dotFront: undefined as any,
  dotBack: undefined as any,
  signature: undefined as any,
};

export const applicantDrivingExperience: ApplicantDrivingExperienceType = {
  drivingExperiences: [
    {
      category: "",
      type: "",
      fromDate: "",
      toDate: "",
      approxMilesTotal: "",
    },
  ],
};

export const applicantAccidentHistory: ApplicantAccidentHistoryType = {
  accidentHistory: [
    {
      accidentDate: "",
      accidentNature: "",
      injuriesCount: "",
      fatalitiesCount: "",
      chemicalSpill: "",
    },
  ],
};

export const applicantTrafficConvictions = {
  trafficConvictions: [
    {
      dateConvicted: "",
      violation: "",
      state: "",
      penalty: "",
      licenseDenied: "",
      licenseDeniedReason: "",
      licenseSuspended: "",
      licenseSuspendedReason: "",
    },
  ],
};

export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
];

export const CDL_CLASSES = ["Non-CDL", "Class A", "Class B", "Class C"];

export const CDL_ENDORSEMENTS = [
  "None",
  "Hazardous Materials (H)",
  "Tank Vehicle (N)",
  "Double / Triple Trailers (T)",
  "Passenger (P)",
  "School Bus (S)",
];

export const EQUEPMENT_CATGORIES = [
  "Straight Truck",
  "Tractor (Combination Vehicle)",
  "Bus / Passenger Vehicle",
  "Other",
];

export const EQUIPMENT_TYPES = [
  "Van / Box Truck",
  "Flatbed Truck",
  "Tractor & Semi-Trailer",
  "Tractor & Double Trailers",
  "Tractor & Tanker",
  "Passenger Bus",
  "Other (Specify)",
];

export const jobApplicationStatusMap = {
  new: {
    label: "New",
    color: "#F59E0B",
    icon: Circle,
    actions: [
      {
        label: "Interview",
        action: "interview",
        icon: MessageCircle,
      },
      {
        label: "Reject Application",
        action: "rejected",
        icon: XCircle,
      },
    ],
  },
  interview: {
    label: "Interview",
    color: "#8B5CF6",
    icon: MessageCircle,
    actions: [
      {
        label: "Send Agreement",
        action: "pending",
        icon: Clock,
      },
      {
        label: "Move to Hired",
        action: "hired",
        icon: CheckCircle,
      },
      {
        label: "Reject Application",
        action: "rejected",
        icon: XCircle,
      },
    ],
  },
  pending: {
    label: "Pending",
    color: "#3B82F6",
    icon: Clock,
    actions: [
      {
        label: "Move to Hired",
        action: "hired",
        icon: CheckCircle,
      },
      {
        label: "Reject Application",
        action: "rejected",
        icon: XCircle,
      },
    ],
  },
  hired: {
    label: "Hired",
    color: "#22C55E",
    icon: CheckCircle,
    actions: [],
  },
  rejected: {
    label: "Rejected",
    color: "#EF4444",
    icon: XCircle,
    actions: [
      {
        label: "Move to Review",
        action: "new",
        icon: CheckCircle,
      },
    ],
  },
} as const;

export const JOB_APPLICATION_REJECT_OPTIONS: string[] = [
  "Did not meet minimum qualifications",
  "Insufficient relevant experience",
  "Position filled by another candidate",
  "Failed background check",
  "Unavailable for required schedule",
  "Poor interview performance",
];

export const JOB_STATUS_DIALOG_CONFIG = {
  reject: {
    title: "Reject Application",
    description: "Please provide a reason for rejecting this application.",
    reasonLabel: "Detailed Reason.",
    reasonDescription:
      "Enter the reason for rejection. The applicant may be notified.",
    submitLabel: "Reject",
    successMessage: "Application has been rejected!",
    status: "rejected",
  },
  interview: {
    title: "Send Interview Details",
    description:
      "Enter the interview details below. The applicant will be notified.",
    reasonLabel: "Interview Details.",
    reasonDescription:
      "Enter the interview details (date, time, location or meeting link)",
    submitLabel: "Send",
    successMessage: "Interview details sent successfully.",
    status: "interview",
  },
};

export const jobPostStatusMap = {
  draft: {
    label: "Draft",
    color: "#F59E0B",
    icon: FileEdit,
    actions: [
      {
        label: "Publish",
        action: "published",
        icon: CheckCircle,
      },
    ],
  },
  published: {
    label: "Published",
    color: "#22C55E",
    icon: CheckCircle,
    actions: [
      {
        label: "Move to Draft",
        action: "draft",
        icon: FileEdit,
      },
    ],
  },
};
