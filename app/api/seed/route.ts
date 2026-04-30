import custR from "@/tax-r.json";
import { getInitialsAvatar } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const ids = [28, 46, 78, 110, 121, 126, 129, 145];

const cr = custR.filter((c) => ids.includes(Number(c.number)));

const all = [...cr].map((s, i) => ({
  name: s.name,
  logo: getInitialsAvatar(s.name),
  organizationId: "mqOPuBzDmgNXU8jv862yiQrvP3bVPB0p",
  managerName: s.name,
  phone: `${s.number}`.padStart(10, "0"),
  email: `${s.number}`.padStart(6, "0") + "@local.com",
}));

export const GET = async () => {
  //   const promises = all.map((s) =>
  //     auth.api.createTeam({
  //       body: { ...s },
  //     }),
  //   );

  //   await Promise.all(promises);

  return NextResponse.json({ message: "Teams seeded successfully" });
};
