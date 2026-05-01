import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";

import { product } from "@/lib/db/schema";
import { NextResponse } from "next/server";

const org = {
  lf: "knDzquD2nM46AF1WPpKY1EmJZrOOzM2M",
  rb: "mqOPuBzDmgNXU8jv862yiQrvP3bVPB0p",
};

export const GET = async () => {
  // const lfItems = lf.map((i) => {
  //   return {
  //     identifier: i.code,
  //     title: i.description ?? "",
  //     description: i.description as string,
  //     basePrice: i.price,
  //     categories: i.categories.split(":"),
  //     organizationId: org.lf,
  //   };
  // });

  // const rbItems = rb.map((i) => {
  //   return {
  //     identifier: i.code,
  //     title: i.description ?? "",
  //     description: i.description as string,
  //     basePrice: i.price,
  //     categories: i.categories.split(":"),
  //     organizationId: org.rb,
  //   };
  // });

  // const allItems = [...lfItems, ...rbItems];

  // const res = await db
  //   .insert(product)
  //   .values(allItems)
  //   .onConflictDoUpdate({
  //     target: [product.identifier, product.organizationId],
  //     set: {
  //       title: sql`excluded.title`,
  //       description: sql`excluded.title`,
  //       basePrice: sql`excluded.base_price`,
  //       categories: sql`excluded.categories`,
  //     },
  //   });

  return NextResponse.json({
    message: "products status updated successfully",
  });
};
