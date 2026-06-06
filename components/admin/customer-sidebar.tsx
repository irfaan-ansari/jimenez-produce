"use client";

import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Session } from "@/lib/types";
import { ChevronRight, Plus } from "lucide-react";
import { TeamSwitcher } from "./team-switcher";
import { SIDEBAR_MENU_CUSTOMER } from "@/lib/config";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { usePromotionsCustomer } from "@/hooks/data/promotions";
import { useLocalStorage } from "@/hooks/use-local-storage";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Tooltip } from "../tooltip";

export function AppSidebar({ session }: { session: Session }) {
  const { pathname, getQueryString } = useRouterStuff();

  const isActive = (href: string) => {
    return pathname === href || (pathname.includes(href) && pathname !== "/");
  };

  const isSubItemActive = (href: any) => {
    if (!href) return false;
    const path = pathname + getQueryString();
    return href === path;
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      {/* <SidebarLogo /> */}
      <TeamSwitcher session={session} />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SIDEBAR_MENU_CUSTOMER.map((item) => {
              const Icon = item.icon;
              if (item.items.length <= 0) {
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                      className="h-11 px-3 transition duration-200 group-data-[collapsible=icon]:px-1.5! [&>svg]:size-5!"
                    >
                      <Link href={item.href}>
                        {item.icon && <item.icon />}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
              return (
                <Collapsible
                  key={item.href}
                  asChild
                  className="group/collapsible"
                  defaultOpen={isActive(item.href)}
                  data-active={isActive(item.href)}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={isActive(item.href)}
                        className="h-11 px-3 transition duration-200 group-data-[collapsible=icon]:px-1.5! [&>.duo-icons]:size-5"
                        asChild
                      >
                        <Link href={item.href}>
                          {item.icon && <item.icon />}
                          <span>{item.label}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </Link>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-5">
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem
                            key={subItem.href}
                            className="after:absolute after:top-1/2 after:-left-3.5 after:size-2 after:-translate-y-1/2  after:rounded-full after:bg-(--color) after:opacity-0 after:transition group-data-[active=true]/collapsible:after:opacity-100"
                            style={
                              {
                                "--color": subItem.color,
                              } as React.CSSProperties
                            }
                          >
                            <SidebarMenuSubButton
                              asChild
                              className="px-3"
                              isActive={isSubItemActive(subItem.href)}
                            >
                              <Link href={subItem.href}>
                                <span>{subItem.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <PromotionCard session={session} />
    </Sidebar>
  );
}

const STORAGE_KEY = "order-line-items";

const PromotionCard = ({ session }: { session: Session }) => {
  const storageKey = `${STORAGE_KEY}-${session?.session?.activeTeamId}`;
  const { router } = useRouterStuff();
  const { set, value } = useLocalStorage(storageKey, []);

  const { data, isPending, isError } = usePromotionsCustomer({
    placement: "sidebar",
  });

  const mappedProducts = React.useMemo(() => {
    return (
      data?.data
        ?.flatMap((item) => item.products ?? [])
        .map((p) => ({
          productId: p.id,
          title: p.title,
          image: p.image,
          identifier: p.identifier,
          categories: p.categories ?? [],
          price: p.finalPrice,
          total: p.finalPrice,
          quantity: "1",
          isTaxable: p.isTaxable ?? false,
        })) ?? []
    );
  }, []);

  const handleAddToCart = React.useCallback(() => {
    let newItems = [...mappedProducts];
    if (Array.isArray(value) && value.length > 0) {
      newItems = [...value, ...mappedProducts];
    }
    set(newItems as []);
    router.push("/customer/new-order");
  }, [data]);

  if (isPending || isError) return null;

  if (data?.data.length > 0) {
    return (
      <SidebarFooter>
        <SidebarGroup className="group-data-[state=collapsed]:hidden mt-6">
          <SidebarMenu className="mb-4">
            <Carousel>
              <CarouselContent>
                {data?.data?.map((p) => (
                  <CarouselItem key={p.id}>
                    <SidebarMenuItem onClick={handleAddToCart}>
                      <div className="relative bg-secondary rounded-xl hover:-translate-y-0.5 transition">
                        <img
                          src={p.media ?? ""}
                          className="object-contain size-full rounded-xl"
                        />
                        {p.products.length > 0 && (
                          <Tooltip content="Add to Cart">
                            <Button
                              variant="default"
                              size="icon-sm"
                              className="absolute right-3 bottom-3"
                            >
                              <Plus />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </SidebarMenuItem>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {data.data?.length > 1 && (
                <>
                  <CarouselPrevious className="-left-2" />
                  <CarouselNext className="-right-2" />
                </>
              )}
            </Carousel>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    );
  }

  return (
    <SidebarGroup className="group-data-[state=collapsed]:hidden">
      <SidebarMenu className="mb-4">
        <SidebarMenuItem className="relative p-4 bg-linear-to-br from-lime-100 via-emerald-50 to-white">
          <div className="mb-1 font-semibold dark:text-background">
            Reorder smarter
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Your top items and recent purchases are ready to add in seconds.
            <br />
            <span className="bg-lime-200 py-0.5 rounded-lg text-xs px-2 inline-block mt-2">
              Coming Soon
            </span>
          </p>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/customer/new-order">Start New Order</Link>
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};
