import {
  AlertCircle,
  CircleDashed,
  Crown,
  PackageCheck,
  Shield,
  User,
} from "lucide-react";

export const roleMap = {
  user: {
    label: "User",
    icon: Shield,
    color: "#1D4ED8",
  },
  admin: {
    label: "Admin",
    icon: Crown,
    color: "#6D28D9",
  },
  customer: {
    label: "Customer",
    icon: User,
    color: "#000000",
  },
};
