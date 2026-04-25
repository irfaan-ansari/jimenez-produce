import { getSession } from "@/server/auth";
import { ERROR_MESSAGE } from "./error-message";
import { NextRequest, NextResponse } from "next/server";

type Auth = NonNullable<Awaited<ReturnType<typeof getSession>>>;
type HandlerContext = {
  req: NextRequest;
  auth: Auth;
};

export function apiHandler(
  handler: (ctx: HandlerContext) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    try {
      const auth = await getSession();

      if (!auth) {
        return NextResponse.json(
          { error: ERROR_MESSAGE.UNAUTHORIZED },
          { status: 401 },
        );
      }

      return await handler({ req, auth });
    } catch (error) {
      console.error("[API_ERROR]", error);

      return NextResponse.json(
        { error: ERROR_MESSAGE.INTERNAL_ERROR },
        { status: 500 },
      );
    }
  };
}
