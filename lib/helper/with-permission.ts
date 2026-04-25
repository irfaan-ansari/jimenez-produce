import { NextResponse } from "next/server";
import { getActiveUser, getSession } from "@/server/auth";
import { hasPermission, Permission, Role } from "@/lib/auth/permissions";

type Handler = (ctx: {
  auth: Awaited<ReturnType<typeof getSession>>;
  req: Request;
}) => Promise<Response>;

export function withPermission(permission: Permission, handler: Handler) {
  return async (req: Request) => {
    const auth = await getSession();

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { activeOrganizationId, userId } = auth.session;

    const activeUser = await getActiveUser(userId!);

    if (!activeUser) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!hasPermission(activeUser.role as Role, permission)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return handler({ auth, req });
  };
}

export function withTeamPermission(permission: Permission, handler: Handler) {
  return async (req: Request) => {
    const auth = await getSession();

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { activeOrganizationId, userId } = auth.session;

    const activeUser = await getActiveUser(userId!);

    if (!activeUser) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!hasPermission(activeUser.role as Role, permission)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return handler({ auth, req });
  };
}
