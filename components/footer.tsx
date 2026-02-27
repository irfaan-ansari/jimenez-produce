import Link from "next/link";
import Image from "next/image";
import {
  COVERAGE_LOCATIONS,
  HOME_SECTIONS,
  CONTACT_SECTIONS,
} from "@/lib/constants/web";
import { Container } from "./container";
import { SITE_CONFIG } from "@/lib/config";
import { AtSign, MapPinned, Phone } from "lucide-react";
const { categories } = HOME_SECTIONS;

export const Footer = () => {
  return (
    <footer className="bg-secondary  py-16">
      <Container>
        <div className="grid grid-cols-9 gap-8">
          {/* branding */}
          <div className="col-span-9 md:col-span-3 space-y-8">
            <Link
              href="/"
              className="rounded-full inline-block ring-2 ring-offset-background ring-primary/20"
            >
              <Image
                width={100}
                height={100}
                alt="Logo"
                src={SITE_CONFIG.logo}
                className="w-full max-w-24 object-contain aspect-square"
              />
            </Link>
            <div className="flex flex-col gap-6">
              {CONTACT_SECTIONS.locations.map((loc) => (
                <div className="space-y-2" key={loc.name}>
                  <h5 className="text-lg font-semibold">{loc.name}</h5>
                  <div className="space-y-1">
                    {loc.phone && (
                      <div className="flex items-center gap-2">
                        <span className="shadow-sm size-8 rounded-full text-primary-foreground bg-highlight inline-flex items-center justify-center">
                          <Phone className="size-4" />
                        </span>
                        <a
                          href={`tel:${loc.phone}`}
                          className="text-muted-foreground hover:underline hover:text-foreground transition ease-out"
                        >
                          {loc.phone}
                        </a>
                      </div>
                    )}
                    {loc.email && (
                      <div className="flex items-center gap-2">
                        <span className="shadow-sm size-8 rounded-full text-primary-foreground bg-highlight inline-flex items-center justify-center">
                          <AtSign className="size-4" />
                        </span>
                        <a
                          href={`mailto:${loc.email}`}
                          className="text-muted-foreground hover:underline hover:text-foreground transition ease-out"
                        >
                          {loc.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="shadow-sm size-8 rounded-full text-primary-foreground bg-highlight inline-flex items-center justify-center">
                        <MapPinned className="size-4" />
                      </span>
                      <p className="text-muted-foreground">{loc.street}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* categories */}
          <div className="col-span-9 md:col-span-2">
            <div className="space-y-6">
              <h5 className="font-medium font-heading uppercase">Categories</h5>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.title}
                    href={`/catalog?cat=${cat.title}`}
                    className="py-1 hover:underline hover:text-primary transition ease-out"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* coverage area */}
          <div className="col-span-9 md:col-span-2">
            <div className="space-y-6">
              <h5 className="font-medium font-heading uppercase">
                Coverage Area
              </h5>
              <div className="flex flex-col gap-2">
                {COVERAGE_LOCATIONS.slice(0, 8).map((covrage) => (
                  <span
                    key={`${covrage.label}${covrage.lng}`}
                    className="py-1 opacity-80"
                  >
                    {covrage.label}
                  </span>
                ))}
                <Link
                  href="/about"
                  className="py-1 hover:underline hover:text-primary transition ease-out"
                >
                  More...
                </Link>
              </div>
            </div>
          </div>

          {/* menu */}
          <div className="col-span-9 md:col-span-2">
            <div className="space-y-6">
              <h5 className="font-medium font-heading uppercase">Menu</h5>
              <div className="flex flex-col gap-2">
                {SITE_CONFIG.pages.map((page) => (
                  <Link
                    key={page.label}
                    href={page.href}
                    className="py-1 hover:text-primary hover:underline transition ease-out"
                  >
                    {page.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-16">
          <div>
            &copy; <CurrentYear /> {SITE_CONFIG.name} • All rights reserved
          </div>
          <div className="flex gap-2 items-center">
            <Link
              href="/"
              className="hover:text-primary hover:underline transition ease-out"
            >
              Terms and Condtions
            </Link>
            <span>•</span>
            <Link
              href="/"
              className="hover:text-primary hover:underline transition ease-out"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

const CurrentYear = () => {
  const year = new Date().getFullYear();
  return <time>{year}</time>;
};
