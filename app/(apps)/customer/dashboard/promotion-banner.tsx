"use client";

import { usePromotionsCustomer } from "@/hooks/data/promotions";

export const PromotionBanner = () => {
  const { data, isPending, isError } = usePromotionsCustomer({
    placement: "banner",
  });

  if (isPending || isError) return null;

  return data.data.map((p) => (
    <div className="col-span-6" key={p.id}>
      <div
        className="relative flex items-center border-2 h-36 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%), #000000",
        }}
      >
        {p.media && (
          <div className="aspect-[0.8/1] lg:aspect-video relative shrink-0 h-full">
            <img
              src={p.media}
              className="absolute w-full h-auto translate-y-8 lg:h-full lg:scale-140 lg:-translate-2 -rotate-5 scale-200 drop-shadow-xs drop-shadow-sidebar-accent"
            />
          </div>
        )}
        <div className="relative p-4 z-1">
          <div className="mb-1 text-xl font-bold text-primary-foreground">
            {p.title}
          </div>
          <p className="mb-4 text-sm text-primary-foreground opacity-80">
            {p.description}
          </p>
        </div>
        {p.badge && (
          <span className="absolute right-4 top-4 rounded-md text-xs h-6 px-2.5 inline-flex items-center justify-center font-medium bg-background">
            {p.badge}
          </span>
        )}
      </div>
    </div>
  ));
};
