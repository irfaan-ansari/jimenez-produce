import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Tag,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Dashboard,
  FolderOpen,
  ShoppingBag,
  Settings as SettingsDuo,
  CoinStack,
} from "@duo-icons/react";

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
    label: "Orders",
    icon: Inbox,
    href: "/admin/orders",
    items: [
      {
        label: "All",
        href: "/admin/orders",
        color: "#A1A1AA",
        query: { status: "" },
      },
      {
        label: "Active",
        href: "/admin/orders?status=in_progress",
        color: "#F59E0B",
      },
      {
        label: "Delayed",
        href: "/admin/orders?status=delayed",
        color: "#EF4444",
      },
      {
        label: "Completed",
        href: "/admin/orders?status=completed",
        color: "#22C55E",
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
      },
      {
        label: "Active",
        href: "/admin/products?status=active",
        color: "#22C55E",
      },
      {
        label: "Private",
        href: "/admin/products?status=private",
        color: "#6366F1",
      },
      {
        label: "Archived",
        href: "/admin/products?status=archived",
        color: "#71717A",
      },
      {
        label: "Price Level",
        href: "/admin/products/price-level",
        color: "#A1A1AA",
      },
      {
        label: "Tax Rules",
        href: "/admin/products/tax-rules",
        color: "#A1A1AA",
      },
      {
        label: "Catalog Requests",
        href: "/admin/products/catalog-requests",
        color: "#A1A1AA",
      },
    ],
  },
  {
    label: "Warehouses",
    icon: Building2,
    href: "/admin/warehouses",
    items: [],
  },
  {
    label: "Customers",
    icon: BriefcaseBusiness,
    href: "/admin/customers",
    items: [],
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
    items: [],
  },
];

export const APPLICATION_GROUP = [
  {
    label: "Customer",
    icon: BriefcaseBusiness,
    href: "/admin/applications",
    items: [
      {
        label: "All",
        href: "/admin/applications",
        color: "#A1A1AA",
      },
      {
        label: "New",
        href: "/admin/applications?status=new",
        color: "#F59E0B",
      },
      {
        label: "Under Review",
        href: "/admin/applications?status=under_review",
        color: "#8B5CF6",
      },
      {
        label: "Approved",
        href: "/admin/applications?status=active",
        color: "#22C55E",
      },
      {
        label: "On Hold",
        href: "/admin/applications?status=on_hold",
        color: "#3B82F6",
      },
      {
        label: "Rejected",
        href: "/admin/applications?status=rejected",
        color: "#EF4444",
      },
      {
        label: "Data Submitted",
        href: "/admin/applications?status=submitted",
        color: "#A1A1AA",
      },
      {
        label: "Invites",
        href: "/admin/applications/invites",
        color: "#A1A1AA",
      },
    ],
  },
  {
    label: "Job",
    icon: ClipboardList,
    href: "/admin/job-applications",
    items: [
      {
        label: "All",
        href: "/admin/job-applications",
        color: "#A1A1AA",
      },
      {
        label: "New",
        href: "/admin/job-applications?status=new",
        color: "#F59E0B",
      },
      {
        label: "Interview",
        href: "/admin/job-applications?status=interview",
        color: "#8B5CF6",
      },
      {
        label: "Agreement",
        href: "/admin/job-applications?status=pending",
        color: "#3B82F6",
      },
      {
        label: "Hired",
        href: "/admin/job-applications?status=hired",
        color: "#22C55E",
      },
      {
        label: "Rejected",
        href: "/admin/job-applications?status=rejected",
        color: "#EF4444",
      },
      {
        label: "Invites",
        href: "/admin/job-applications/job-invites",
        color: "#A1A1AA",
      },
    ],
  },
];
export const SIDEBAR_MENU_CUSTOMER = [
  {
    label: "Dashboard",
    icon: Dashboard,
    href: "/customer/dashboard",
    items: [],
  },
  {
    label: "New Order",
    icon: ShoppingBag,
    href: "/customer/new-order",
    items: [],
  },
  {
    label: "Orders",
    icon: FolderOpen,
    href: "/customer/orders",
    items: [
      {
        label: "All",
        href: "/customer/orders",
        color: "#A1A1AA",
      },
      {
        label: "In Progress",
        href: "/customer/orders?status=in_progress",
        color: "#F59E0B",
      },
      {
        label: "Past Orders",
        href: "/customer/orders?status=completed",
        color: "#22C55E",
      },
    ],
  },
  {
    label: "Products",
    icon: CoinStack,
    href: "/customer/products",
    items: [],
  },
  {
    label: "Settings",
    icon: SettingsDuo,
    href: "/customer/settings",
    items: [],
  },
];
