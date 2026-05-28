import { handleAction } from "@/lib/helper/error-handler";
import { getSession } from "@/services/auth";
import { db } from "@/services/db";

/**
 * get team tax rules
 * @returns data
 */
export const getTaxRule = handleAction(async () => {
  const session = await getSession();

  if (!session) throw new Error("Authentication required.");

  const { activeOrganizationId, activeTeamId } = session.session;

  if (!activeTeamId || !activeOrganizationId)
    throw new Error("No active organization or team found.");

  const team = await db.query.team.findFirst({
    where: (t, { eq }) => eq(t.id, activeTeamId),
    with: {
      taxRule: true,
    },
  });

  return team?.taxRule;
});
