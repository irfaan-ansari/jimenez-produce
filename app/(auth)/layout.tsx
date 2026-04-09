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
    <div className="flex min-h-svh grid grid-cols-1 md:grid-cols-2">
      <div className="bg-linear-to-br from-lime-950 to-primary flex flex-col">
        <div className="max-w-md flex flex-col text-white items-start h-full mx-auto gap-6 justify-center">
          <div className="bg-background p-2 rounded-full mb-10">
            <Image
              width={100}
              height={100}
              alt="Logo"
              src={SITE_CONFIG.logo}
              className="w-full max-w-24 object-contain aspect-square"
            />
          </div>
          <h2 className="text-5xl font-extrabold leading-snug font-heading uppercase">
            Fresh ordering made simple
          </h2>
          <p className="text-xl font-medium">
            Log in or register to your Jimezez Produce portal to place orders,
            view invoices, and manage deliveries with ease.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
