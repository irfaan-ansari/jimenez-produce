"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  App,
  Dashboard,
  FolderOpen,
  FolderUpload,
  ShoppingBag,
} from "@duo-icons/react";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  highlight?: boolean;
}

interface MobileNavbarProps {
  className?: string;
}

const BOTTOM_NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/customer/dashboard",
    icon: <Dashboard />,
  },
  {
    label: "Orders",
    href: "/customer/orders",
    icon: <FolderOpen />,
  },
  {
    label: "New Order",
    href: "/customer/new-order",
    icon: <ShoppingBag />,
    highlight: true,
  },
  {
    label: "Order Guide",
    href: "/customer/order-guides",
    icon: <FolderUpload />,
  },
];

export function MobileNavbar({ className }: MobileNavbarProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 h-20 bg-background shadow-[0_-2px_5px_rgba(0,0,0,0.1)]",
        "flex items-center justify-around px-2 py-2",
        "md:hidden",
        className,
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            data-active={isActive}
            className={cn(
              "relative group flex flex-col items-center justify-center gap-1.5 p-2 transition-colors duration-200",
              "rounded-lg text-sm font-medium",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <div className="flex items-center [&>svg]:size-7! justify-center transition-transform duration-200">
              {item.icon}
            </div>

            {item.label && (
              <span className="line-clamp-1 opacity-70 group-data-[active=true]:opacity-100">
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
      <Button
        className="[&>svg]:size-7! h-auto gap-1.5 flex flex-col p-2"
        variant="ghost"
        size="sm"
        type="button"
        onClick={toggleSidebar}
      >
        <App />
        <span className="line-clamp-1">Menu</span>
      </Button>
    </nav>
  );
}
