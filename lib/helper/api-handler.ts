import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGE } from "./error-message";
import { getSession } from "@/server/auth";

type Auth = NonNullable<Awaited<ReturnType<typeof getSession>>>;

type HandlerContext<TParams = {}> = {
  req: NextRequest;
  auth: Auth;
  params: TParams;
};

export function apiHandler<TParams = {}>(
  handler: (ctx: HandlerContext<TParams>) => Promise<NextResponse>,
) {
  return async (req: NextRequest, context: { params: TParams }) => {
    try {
      const auth = await getSession();

      if (!auth) {
        return NextResponse.json(
          { error: ERROR_MESSAGE.UNAUTHORIZED },
          { status: 401 },
        );
      }

      return await handler({
        req,
        auth,
        params: context.params,
      });
    } catch (error) {
      console.error("[API_ERROR]", error);

      return NextResponse.json(
        { error: ERROR_MESSAGE.INTERNAL_ERROR },
        { status: 500 },
      );
    }
  };
}
