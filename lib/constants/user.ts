import {
  Briefcase,
  Crown,
  ShieldCheck,
  Star,
  User,
  Users,
  Lock,
} from "lucide-react";

export const roleMap = {
  owner: {
    label: "Owner",
    icon: Crown,
    color: "#F59E0B",
  },
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    color: "#7C3AED",
  },
  manager: {
    label: "Manager",
    icon: Briefcase,
    color: "#2563EB",
  },
  member: {
    label: "Member",
    icon: Users,
    color: "#059669",
  },
  user: {
    label: "User",
    icon: User,
    color: "#6B7280",
  },
  customer: {
    label: "Customer",
    icon: Star,
    color: "#EC4899",
  },
  none: {
    label: "None",
    icon: Lock,
    color: "#6B7280",
  },
};
