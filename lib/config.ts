import {
  ClipboardList,
  Inbox,
  LayoutDashboard,
  Settings,
  ShoppingCart,
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
        label: "Catalog Requests",
        href: "/admin/products/catalog-requests",
        color: "#A1A1AA",
      },
    ],
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
      },
      {
        label: "New",
        href: "/admin/customers?status=new",
        color: "#F59E0B",
      },
      {
        label: "Under Review",
        href: "/admin/customers?status=under_review",
        color: "#8B5CF6",
      },
      {
        label: "Approved",
        href: "/admin/customers?status=active",
        color: "#22C55E",
      },
      {
        label: "On Hold",
        href: "/admin/customers?status=on_hold",
        color: "#3B82F6",
      },
      {
        label: "Rejected",
        href: "/admin/customers?status=rejected",
        color: "#EF4444",
      },
      {
        label: "Data Submitted",
        href: "/admin/customers?status=submitted",
        color: "#A1A1AA",
      },
      {
        label: "Invites",
        href: "/admin/customers/invites",
        color: "#A1A1AA",
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
  // {
  //   label: "Catalog Requests",
  //   icon: Shield,
  //   href: "/admin/catalog-requests",
  //   items: [
  //     {
  //       label: "All",
  //       href: "/admin/catalog-requests",
  //       color: "#A1A1AA",
  //     },
  //     {
  //       label: "New",
  //       href: "/admin/catalog-requests?status=new",
  //       color: "#F59E0B",
  //     },
  //     {
  //       label: "Approved",
  //       href: "/admin/catalog-requests?status=approved",
  //       color: "#22C55E",
  //     },
  //     {
  //       label: "Rejected",
  //       href: "/admin/catalog-requests?status=rejected",
  //       color: "#EF4444",
  //     },
  //     {
  //       label: "Revoked",
  //       href: "/admin/catalog-requests?status=revoked",
  //       color: "#71717A",
  //     },
  //   ],
  // },
  // {
  //   label: "Candidate Invitations",
  //   icon: ClipboardClock,
  //   href: "/admin/job-invites",
  //   items: [
  //     {
  //       label: "All",
  //       href: "/admin/job-invites",
  //       color: "#71717A",
  //     },
  //     {
  //       label: "Invited",
  //       href: "/admin/job-invites?status=invited",
  //       color: "#F59E0B",
  //     },
  //     {
  //       label: "Applied",
  //       href: "/admin/job-invites?status=applied",
  //       color: "#3B82F6",
  //     },
  //     {
  //       label: "Hired",
  //       href: "/admin/job-invites?status=hired",
  //       color: "#22C55E",
  //     },
  //   ],
  // },
  // {
  //   label: "Customer Invitations",
  //   icon: MailPlus,
  //   href: "/admin/invites",
  //   items: [
  //     {
  //       label: "All",
  //       href: "/admin/invites",
  //       color: "#71717A",
  //     },
  //     {
  //       label: "Invited",
  //       href: "/admin/invites?status=invited",
  //       color: "#F59E0B",
  //     },
  //     {
  //       label: "Applied",
  //       href: "/admin/invites?status=applied",
  //       color: "#3B82F6",
  //     },
  //     {
  //       label: "Approved",
  //       href: "/admin/invites?status=converted",
  //       color: "#22C55E",
  //     },
  //   ],
  // },

  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
    items: [],
  },
];

export const SIDEBAR_MENU_CUSTOMER = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/customer/dashboard",
    items: [],
  },
  {
    label: "New Order",
    icon: ShoppingCart,
    href: "/customer/new-order",
    items: [],
  },
  {
    label: "Orders",
    icon: Inbox,
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
    icon: Tag,
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
