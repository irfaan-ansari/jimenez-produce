"use client";

import React from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SITE_CONFIG } from "@/lib/config";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MobileNav = ({
  isActive,
}: {
  isActive: (href: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="lg:hidden">
        {open ? <X /> : <Menu />}
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="center"
        sideOffset={20}
        className="w-svw! ring-0 h-(--radix-popper-available-height)"
      >
        <PopoverTitle className="sr-only">Menu</PopoverTitle>

        <ul className="flex flex-col px-4 py-10">
          {SITE_CONFIG.pages.map((page) => (
            <li key={page.href}>
              <Link
                onClick={() => setOpen(false)}
                href={page.href}
                data-active={isActive(page.href)}
                className="text-xl font-semibold py-3 block data-[active=true]:text-primary"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-6 pb-6 mt-auto space-y-4">
          <Button
            asChild
            size="xl"
            className="w-full"
            onClick={() => setOpen(false)}
            variant="secondary"
          >
            <Link href="/contact">Request Catalog</Link>
          </Button>
          <Button
            asChild
            size="xl"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            <Link href="/apply">Apply for an Account</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
