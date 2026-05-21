"use client";
import { Session } from "@/lib/types";
import { Button } from "../ui/button";
import { TeamSwitcher } from "./team-switcher";
import { useSidebar } from "../ui/sidebar";
import { OrganizationSwitcher } from "./organization-switcher";

const AppHeader = ({
  session,
  type,
}: {
  session: Session;
  type: "admin" | "customer";
}) => {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <header className="flex items-center md:hidden justify-between border-b bg-white px-2 py-2 relative">
      <Button variant="ghost" onClick={() => setOpenMobile(!openMobile)}>
        <svg viewBox="0 0 24 24" fill="none" className="size-6">
          <path
            d="M3 12H21M3 6H21M3 18H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>

      {type === "customer" && (
        <TeamSwitcher
          className="**:data-[slot=sidebar-trigger]:hidden p-0"
          session={session}
        />
      )}
      {type === "admin" && (
        <OrganizationSwitcher
          className="**:data-[slot=sidebar-trigger]:hidden p-0"
          session={session}
        />
      )}
    </header>
  );
};

export default AppHeader;
