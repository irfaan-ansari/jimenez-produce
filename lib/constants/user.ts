import {
  Briefcase,
  Crown,
  ShieldCheck,
  Star,
  User,
  Users,
  Lock,
  UserLock,
  BadgeDollarSign,
  Handshake,
} from "lucide-react";

export const roleMap = {
  owner: {
    label: "Owner",
    icon: Crown,
    color: "#F59E0B",
  },
  manager: {
    label: "Manager",
    icon: ShieldCheck,
    color: "#2563EB",
  },
  member: {
    label: "Member",
    icon: User,
    color: "#059669",
  },
  sales: {
    label: "Sales",
    icon: BadgeDollarSign,
    color: "#7C3AED",
  },
  customer: {
    label: "Customer",
    icon: Handshake,
    color: "#4b5563",
  },
  none: {
    label: "None",
    icon: Lock,
    color: "#6B7280",
  },
};
