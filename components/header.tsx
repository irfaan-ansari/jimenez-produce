"use client";
import Link from "next/link";
import Image from "next/image";
import { MobileNav } from "./mobile-nav";
import { SITE_CONFIG } from "@/lib/config";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (pathname.startsWith(href) && href !== "/");
  };

  return (
    <header className="sticky top-0 z-10 bg-background shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex w-full items-center">
          <div className="inline-flex flex-[1_1_0]">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary">
                <Image
                  width={500}
                  height={500}
                  alt="Logo"
                  src={SITE_CONFIG.logo2}
                  className="w-full max-w-32 md:max-w-36"
                />
              </h1>
            </Link>
          </div>
          <nav className="items-center justify-center hidden md:flex">
            <ul className="flex items-center gap-4">
              {SITE_CONFIG.pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    data-active={isActive(page.href)}
                    className="py-2.5 px-1.5 font-medium data-[active=true]:text-primary hover:text-primary transition ease-out"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex-[1_1_0] justify-end hidden md:flex">
            <Button asChild size="xl">
              <Link href="/apply">Apply for an Account</Link>
            </Button>
          </div>
          <MobileNav isActive={isActive} />
        </div>
      </div>
    </header>
  );
};
