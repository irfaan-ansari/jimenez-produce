import {
  ClipboardList,
  LayoutDashboard,
  MailPlus,
  Shield,
  Tag,
  UserPlus,
  Users,
} from "lucide-react";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export const SITE_CONFIG = {
  name: "Jimenez Produce",
  url: SITE_URL,
  appUrl: SITE_URL,
  logo: "/logo.png",
  logo2: "/logo-2.jpg",
  pages: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Catalog",
      href: "/products",
    },
    {
      label: "Contact",
      href: "/contact",
    },
    {
      label: "Careers",
      href: "/careers",
    },
  ],
};

export const SIDEBAR_MENU = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/admin/overview",
    items: [],
  },
  {
    label: "Customers",
    icon: UserPlus,
    href: "/admin/customers",
    items: [
      {
        label: "All",
        href: "/admin/customers",
        color: "#A1A1AA",
        query: { status: "" },
      },
      {
        label: "New",
        href: "/admin/customers",
        color: "#F59E0B",
        query: { status: "new" },
      },
      {
        label: "Under Review",
        href: "/admin/customers",
        color: "#8B5CF6",
        query: { status: "under_review" },
      },
      {
        label: "Approved",
        href: "/admin/customers",
        color: "#22C55E",
        query: { status: "active" },
      },
      {
        label: "On Hold",
        href: "/admin/customers",
        color: "#3B82F6",
        query: { status: "on_hold" },
      },
      {
        label: "Rejected",
        href: "/admin/customers",
        color: "#EF4444",
        query: { status: "rejected" },
      },
    ],
  },
  {
    label: "Products",
    icon: Tag,
    href: "/admin/products",
    items: [
      {
        label: "All",
        href: "/admin/products",
        color: "#A1A1AA",
        query: { status: "" },
      },
      {
        label: "Active",
        href: "/admin/products",
        color: "#22C55E",
        query: { status: "active" },
      },
      {
        label: "Private",
        href: "/admin/products",
        color: "#6366F1",
        query: { status: "private" },
      },
      {
        label: "Archived",
        href: "/admin/products",
        color: "#71717A",
        query: { status: "archived" },
      },
    ],
  },

  {
    label: "Job Applications",
    icon: ClipboardList,
    href: "/admin/job-applications",
    items: [
      {
        label: "All",
        href: "/admin/job-applications",
        color: "#A1A1AA",
        query: { status: "" },
      },
      {
        label: "New",
        href: "/admin/job-applications",
        color: "#F59E0B",
        query: { status: "new" },
      },
      {
        label: "Interview",
        href: "/admin/job-applications",
        color: "#8B5CF6",
        query: { status: "interview" },
      },
      {
        label: "Pending",
        href: "/admin/job-applications",
        color: "#3B82F6",
        query: { status: "pending" },
      },
      {
        label: "Hired",
        href: "/admin/job-applications",
        color: "#22C55E",
        query: { status: "hired" },
      },

      {
        label: "Rejected",
        href: "/admin/job-applications",
        color: "#EF4444",
        query: { status: "rejected" },
      },
    ],
  },
  {
    label: "Customer Invitations",
    icon: MailPlus,
    href: "/admin/invites",
    items: [
      {
        label: "All",
        href: "/admin/invites",
        color: "#71717A",
        query: { status: "" },
      },
      {
        label: "Invited",
        href: "/admin/invites",
        color: "#F59E0B",
        query: { status: "invited" },
      },
      {
        label: "Applied",
        href: "/admin/invites",
        color: "#3B82F6",
        query: { status: "applied" },
      },
      {
        label: "Approved",
        href: "/admin/invites",
        color: "#22C55E",
        query: { status: "converted" },
      },
    ],
  },
  {
    label: "Catalog Requests",
    icon: Shield,
    href: "/admin/catalog-requests",
    items: [
      {
        label: "All",
        href: "/admin/catalog-requests",
        color: "#A1A1AA",
        query: { status: "" },
      },
      {
        label: "New",
        href: "/admin/invites",
        color: "#F59E0B",
        query: { status: "new" },
      },
      {
        label: "Approved",
        href: "/admin/catalog-requests",
        color: "#22C55E",
        query: { status: "approved" },
      },
      {
        label: "Rejected",
        href: "/admin/catalog-requests",
        color: "#EF4444",
        query: { status: "rejected" },
      },
      {
        label: "Revoked",
        href: "/admin/catalog-requests",
        color: "#71717A",
        query: { status: "revoked" },
      },
    ],
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
    items: [],
  },
];
