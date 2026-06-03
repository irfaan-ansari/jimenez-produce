"use client";

import { usePromotionsCustomer } from "@/hooks/data/promotions";

export const PromotionBanner = () => {
  const { data, isPending, isError } = usePromotionsCustomer({
    placement: "banner",
  });

  if (isPending || isError) return null;

  return data.data.map((p) => (
    <div className="col-span-6" key={p.id}>
      <div className="relative flex items-center">
        <img src={p.media!} className="" />
      </div>
    </div>
  ));
};
