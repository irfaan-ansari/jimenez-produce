"use client";
import React from "react";
import { format } from "date-fns";
import { formatUSD } from "@/lib/utils";
import { useTopProducts } from "@/hooks/use-product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function TopProducts() {
  const { data, isPending } = useTopProducts();

  const items = (data?.data || [])?.map((item, i) => ({
    ...item,
    color: COLORS[i % COLORS.length],
  }));
  console.log(items);
  return (
    <Card className="rounded-2xl ring-0 shadow-none border col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Most Ordered</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {isPending
          ? undefined
          : items.map((product, i) => (
              <div
                key={i}
                className="group cursor-pointer"
                style={{ "--color": product.color } as React.CSSProperties}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl bg-(--color)/20 text-(--color) flex items-center justify-center font-bold`}
                    >
                      {product.title[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{product.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Last Ordered:{" "}
                        {format(product.lastPurchasedAt, "dd MMM")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      {formatUSD(product.totalRevenue)}
                    </p>
                  </div>
                </div>
                {/* The "Relative" Bar */}
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-(--color) opacity-80 group-hover:opacity-100 transition-all`}
                    style={{
                      width: `${(product.totalQuantity / 1240) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
