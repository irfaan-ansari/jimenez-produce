import {
  CheckCircle,
  Circle,
  CircleOff,
  Clock,
  FileEdit,
  FileText,
  MessageCircle,
  PauseOctagon,
  Send,
  Lock,
  Archive,
  Shield,
  Crown,
  User,
  AlertCircle,
  PackageCheck,
  CircleDashed,
} from "lucide-react";

export const STATUS_MAP = {
  new: {
    label: "New",
    color: "#F59E0B",
    icon: Circle,
  },
  under_review: {
    label: "Under Review",
    color: "#8B5CF6",
    icon: FileEdit,
  },
  active: {
    label: "Approved",
    color: "#22C55E",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "#EF4444",
    icon: CircleOff,
  },
  on_hold: {
    label: "On Hold",
    color: "#3B82F6",
    icon: Clock,
  },
  submitted: {
    label: "Submitted",
    color: "#F59E0B",
    icon: Send,
  },
  abandoned: {
    label: "Abandoned",
    color: "#F59E0B",
    icon: PauseOctagon,
  },
  interview: {
    label: "Interview",
    color: "#8B5CF6",
    icon: MessageCircle,
  },
  pending: {
    label: "Agreement",
    color: "#3B82F6",
    icon: Clock,
  },
  hired: {
    label: "Hired",
    color: "#22C55E",
    icon: CheckCircle,
  },
  invited: {
    label: "Invited",
    color: "#F59E0B",
    icon: Send,
  },
  applied: {
    label: "Applied",
    color: "#3B82F6",
    icon: FileText,
  },
  private: {
    label: "Private",
    color: "#6366F1",
    icon: Lock,
  },
  archived: {
    label: "Archived",
    color: "#71717A",
    icon: Archive,
  },
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
  in_progress: {
    label: "In Progress",
    icon: CircleDashed,
    color: "#F59E0B",
  },
  delayed: {
    label: "Delayed",
    icon: AlertCircle,
    color: "#EF4444",
  },
  completed: {
    label: "Completed",
    icon: PackageCheck,
    color: "#22C55E",
  },
};
