import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | Reliable Foodservice Distribution Across the Gulf Coast"`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "Trusted foodservice distributor delivering fresh produce and essential supplies to restaurants and commercial kitchens across the Gulf Coast",
  openGraph: {
    title: `${SITE_CONFIG.name}`,
    description:
      "Trusted foodservice distributor delivering fresh produce and essential supplies to restaurants and commercial kitchens across the Gulf Coast",
    url: SITE_CONFIG.url,
    siteName: `${SITE_CONFIG.name}`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${SITE_CONFIG.name}`,
    card: "summary_large_image",
  },
  verification: {
    google: "",
    yandex: "",
  },
};

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* gradient */}
      {/* <div
        className="absolute inset-0 z-[-1]"
        style={{
          background: "#ffffff",
          backgroundImage: `radial-gradient(circle at 80% 0%,rgba(56, 193, 182, 0.5),transparent 200px)`,
          filter: "blur(120px)",
          backgroundRepeat: "no-repeat",
        }}
      /> */}

      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
