import React from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/config";
import { getSession } from "@/server/auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (session) {
    if (session.user.role === "customer") {
      redirect("/customer/dashboard");
    } else {
      redirect("/admin/overview");
    }
  }

  return (
    <div className="flex overflow-hidden">
      <div className="relative hidden flex-1 flex-col bg-linear-to-br from-lime-950 to-primary px-6 pt-40 md:flex lg:px-16">
        <span className="absolute right-20 bottom-20 size-72 rounded-full border-2 opacity-50"></span>
        <span className="absolute right-44 bottom-44 size-40 rounded-full border-2 opacity-20"></span>
        <div className="flex h-full max-w-xl flex-col items-start gap-6 text-white">
          <div className="mb-10 rounded-full bg-background p-2">
            <Image
              width={100}
              height={100}
              alt="Logo"
              src={SITE_CONFIG.logo}
              className="aspect-square w-full max-w-24 object-contain"
            />
          </div>
          <div className="space-y-4">
            <h2 className="font-heading text-5xl leading-snug font-extrabold uppercase">
              Fresh ordering made simple
            </h2>
            <p className="text-xl font-medium">
              Log in or register to your Jimezez Produce portal to place orders,
              view invoices, and manage deliveries with ease.
            </p>
          </div>
        </div>
      </div>
      <div className="h-svh overflow-auto">{children}</div>
    </div>
  );
};

export default AuthLayout;
