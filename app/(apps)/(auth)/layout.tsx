import React from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/config";
import { getSession } from "@/server/auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (session) {
    if (session.user.accountType === "customer") {
      redirect("/customer/dashboard");
    } else {
      redirect("/admin/overview");
    }
  }

  return (
    <div className="flex overflow-hidden bg-linear-to-br from-lime-950 to-primary">
      <div className="relative flex-col flex-1 hidden px-6 pt-40 md:flex lg:px-16">
        <span className="absolute border-2 rounded-full opacity-50 right-20 bottom-20 size-72"></span>
        <span className="absolute border-2 rounded-full right-44 bottom-44 size-40 opacity-20"></span>
        <div className="flex flex-col items-start h-full max-w-xl gap-6 text-white">
          <div className="p-2 mb-10 rounded-full bg-background">
            <Image
              width={100}
              height={100}
              alt="Logo"
              src={SITE_CONFIG.logo}
              className="object-contain w-full aspect-square max-w-24"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-extrabold leading-snug uppercase font-heading">
              Fresh ordering made simple
            </h2>
            <p className="text-xl font-medium">
              Log in or register to your Jimezez Produce portal to place orders,
              view invoices, and manage deliveries with ease.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto h-svh lg:rounded-l-2xl bg-secondary lg:max-w-xl">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
