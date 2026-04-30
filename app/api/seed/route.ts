import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  //   const promises = all.map((s) =>
  //     auth.api.createTeam({
  //       body: { ...s },
  //     }),
  //   );

  //   await Promise.all(promises);

  return NextResponse.json({ message: "Teams seeded successfully" });
};
