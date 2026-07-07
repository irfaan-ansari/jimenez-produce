import {
  Dashboard,
  FolderOpen,
  ShoppingBag,
  Settings,
  CoinStack,
  Building,
  User,
  Rocket,
  Message,
  Box2,
  Box,
  Approved,
  Bookmark,
  Briefcase,
  Clipboard,
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
    icon: Dashboard,
    href: "/admin/overview",
    items: [],
  },
  {
    label: "Orders",
    icon: Box,
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
    label: "Invoices",
    icon: Clipboard,
    href: "/admin/invoices",
    items: [
      {
        label: "All",
        href: "/admin/invoices",
        color: "#A1A1AA",
        query: { status: "" },
      },
      {
        label: "Unpaid",
        href: "/admin/invoices?status=unpaid",
        color: "#F59E0B",
      },
      {
        label: "Paid",
        href: "/admin/invoices?status=paid",
        color: "#22C55E",
      },
      {
        label: "Partially Paid",
        href: "/admin/invoices?status=partially_paid",
        color: "#F59E0B",
      },
      {
        label: "Overdue",
        href: "/admin/invoices?status=overdue",
        color: "#EF4444",
      },
      {
        label: "Payments",
        href: "/admin/invoices/payments",
        color: "#F59E0B",
      },
    ],
  },

  {
    label: "Products",
    icon: Box2,
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
    ],
  },
  {
    label: "Order Guides",
    icon: FolderOpen,
    href: "/admin/order-guides",
    items: [],
  },
  {
    label: "Marketing",
    icon: Rocket,
    href: "/admin/promotions",
    items: [
      {
        label: "Promotions",
        href: "/admin/promotions",
        color: "#A1A1AA",
      },
      {
        label: "Messaging",
        href: "/admin/promotions/messaging",
        color: "#A1A1AA",
      },
    ],
  },
  {
    label: "Customers",
    icon: Approved,
    href: "/admin/customers",
    items: [],
  },
  {
    label: "Users",
    icon: User,
    href: "/admin/users",
    items: [],
  },
];

export const APPLICATION_GROUP = [
  {
    label: "Customer",
    icon: Bookmark,
    href: "/admin/applications/customer",
    items: [
      {
        label: "All",
        href: "/admin/applications/customer",
        color: "#A1A1AA",
      },
      {
        label: "New",
        href: "/admin/applications/customer?status=new",
        color: "#F59E0B",
      },
      {
        label: "Under Review",
        href: "/admin/applications/customer?status=under_review",
        color: "#8B5CF6",
      },
      {
        label: "Approved",
        href: "/admin/applications/customer?status=active",
        color: "#22C55E",
      },
      {
        label: "On Hold",
        href: "/admin/applications/customer?status=on_hold",
        color: "#3B82F6",
      },
      {
        label: "Rejected",
        href: "/admin/applications/customer?status=rejected",
        color: "#EF4444",
      },
      {
        label: "Data Submitted",
        href: "/admin/applications/customer?status=submitted",
        color: "#A1A1AA",
      },
      {
        label: "Invites",
        href: "/admin/applications/customer/invites",
        color: "#A1A1AA",
      },
    ],
  },
  {
    label: "Candidate",
    icon: Briefcase,
    href: "/admin/applications/candidate",
    items: [
      {
        label: "All",
        href: "/admin/applications/candidate",
        color: "#A1A1AA",
      },
      {
        label: "New",
        href: "/admin/applications/candidate?status=new",
        color: "#F59E0B",
      },
      {
        label: "Interview",
        href: "/admin/applications/candidate?status=interview",
        color: "#8B5CF6",
      },
      {
        label: "Agreement",
        href: "/admin/applications/candidate?status=pending",
        color: "#3B82F6",
      },
      {
        label: "Hired",
        href: "/admin/applications/candidate?status=hired",
        color: "#22C55E",
      },
      {
        label: "Rejected",
        href: "/admin/applications/candidate?status=rejected",
        color: "#EF4444",
      },
      {
        label: "Invites",
        href: "/admin/applications/candidate/invites",
        color: "#A1A1AA",
      },
    ],
  },
  {
    label: "Catalog Requests",
    href: "/admin/applications/catalog-requests",
    icon: Message,
    items: [],
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
    label: "Invoices",
    icon: Clipboard,
    href: "/customer/invoices",
    items: [
      {
        label: "All",
        href: "/customer/invoices",
        color: "#A1A1AA",
        query: { status: "" },
      },
      {
        label: "Unpaid",
        href: "/customer/invoices?status=unpaid",
        color: "#F59E0B",
      },
      {
        label: "Paid",
        href: "/customer/invoices?status=paid",
        color: "#22C55E",
      },
      {
        label: "Partially Paid",
        href: "/customer/invoices?status=partially_paid",
        color: "#F59E0B",
      },
      {
        label: "Overdue",
        href: "/customer/invoices?status=overdue",
        color: "#EF4444",
      },
      {
        label: "Payments",
        href: "/customer/invoices/payments",
        color: "#F59E0B",
      },
    ],
  },
  {
    label: "Catalog",
    icon: CoinStack,
    href: "/customer/products",
    items: [],
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/customer/settings",
    items: [],
  },
];
