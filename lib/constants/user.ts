import { CircleDashed, Crown, PackageCheck, Shield, User } from "lucide-react";

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

export const orderMap = {
  active: {
    label: "In Progress",
    icon: CircleDashed,
    color: "#F59E0B",
  },
  completed: {
    label: "Completed",
    icon: PackageCheck,
    color: "#22C55E",
  },
};
