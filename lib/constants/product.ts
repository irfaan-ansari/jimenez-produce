import { CheckCircle, Lock, Archive } from "lucide-react";

export const STATUS_MAP = {
  active: {
    label: "Active",
    color: "#22C55E",
    icon: CheckCircle,
    actions: [
      {
        label: "Archive",
        action: "archive",
        icon: Archive,
      },
      {
        label: "Private",
        action: "private",
        icon: Lock,
      },
    ],
  },
  private: {
    label: "Private",
    color: "#6366F1",
    icon: Lock,
    actions: [
      {
        label: "Active",
        action: "active",
        icon: CheckCircle,
      },
      {
        label: "Archive",
        action: "archive",
        icon: Archive,
      },
    ],
  },
  archived: {
    label: "Archived",
    color: "#71717A",
    icon: Archive,
    actions: [
      {
        label: "Active",
        action: "active",
        icon: CheckCircle,
      },
      {
        label: "Private",
        action: "private",
        icon: Lock,
      },
    ],
  },
};
