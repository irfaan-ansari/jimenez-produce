"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePromotionsCustomer } from "@/hooks/data/promotions";
import { Plus } from "lucide-react";

export const PromotionBanner = () => {
  const { data, isPending, isError } = usePromotionsCustomer({
    placement: "banner",
  });

  if (isPending || isError) return null;

  return (
    <Carousel className="col-span-6">
      <CarouselContent>
        {data.data.map((p) => (
          <CarouselItem key={p.id}>
            <div className="relative flex items-center hover:-translate-y-0.5 transition-transform">
              <img src={p.media!} className="object-contain w-full h-auto" />

              {p.products.length > 0 && (
                <Button className="absolute right-4 bottom-4 z-1">
                  <Plus /> Add to Card
                </Button>
              )}
            </div>
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
  );
};
