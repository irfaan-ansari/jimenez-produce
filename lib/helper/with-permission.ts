import { auth } from "@/services/auth";
import { headers } from "next/headers";
import { getSession } from "@/services/auth";
import { ERROR_MESSAGE } from "./error-message";
import { statement } from "@/services/auth/permissions";

type Resource = keyof typeof statement;

type Action<TResource extends Resource> = (typeof statement)[TResource][number];

export type PermissionOptions<TResource extends Resource = Resource> = {
  resource: TResource;
  action: Action<TResource>;
};

export async function withPermission<TResource extends Resource>({
  resource,
  action,
}: PermissionOptions<TResource>) {
  const session = await getSession();

  if (!session) {
    throw new Error(ERROR_MESSAGE.UNAUTHORIZED);
  }

  const { success, error } = await auth.api.hasPermission({
    headers: await headers(),
    body: {
      permissions: {
        [resource]: [action],
      },
    },
  });
  console.log({ success, error });
  if (!success) {
    throw new Error(ERROR_MESSAGE.FORBIDDEN);
  }

  return {
    ...session,
    session: {
      ...session.session,
      activeTeamId: session.session.activeTeamId ?? "",
      activeOrganizationId: session.session.activeOrganizationId ?? "",
    },
  };
}
