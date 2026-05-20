"use server";
import "dotenv/config";

import { db } from "./lib/db";
import { auth } from "@/lib/auth";
import { signUpUser } from "@/server/auth";
import { teamMember } from "./lib/db/auth-schema";

const orgId = "mqOPuBzDmgNXU8jv862yiQrvP3bVPB0p";
async function run() {
  const teams = await db.query.team.findMany({
    where: (team, { eq }) => eq(team.organizationId, orgId),
  });

  let count = 0;
  for (const team of teams) {
    if (team.id === "rDWu7naD9Daj7IDE4FO76lLx04uJGL0S") {
      console.log("skipping excluded team", team.id);
      continue;
    }

    const existingMember = await db.query.teamMember.findFirst({
      where: (teamMember, { eq }) => eq(teamMember.teamId, team.id),
    });

    if (existingMember) {
      console.log("team member already exists", existingMember);
      continue;
    }

    try {
      const { name, phone, email } = team;

      const { user: createdUser } = await signUpUser({
        name,
        phoneNumber: phone,
        email,
        password: crypto.randomUUID(),
        accountType: "customer",
      });

      console.log("signed up", name);

      const createdMember = await auth.api.addMember({
        body: {
          userId: createdUser.id,
          role: "customer",
          organizationId: orgId,
        },
      });

      console.log("organization member added", createdMember.id);

      const [createdTeamMember] = await db
        .insert(teamMember)
        .values({
          id: crypto.randomUUID().replace(/-/g, ""),
          teamId: team.id,
          userId: createdUser.id,
        })
        .returning();

      console.log("assigned team member", createdTeamMember.id);
      count++;
    } catch (err) {
      console.error("error processing team", team.id, err);
    }
  }

  console.log(count, "users created and assigned to teams");
}

run();
