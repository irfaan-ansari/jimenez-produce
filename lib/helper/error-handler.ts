import { DrizzleQueryError } from "drizzle-orm";
import { ActionResult } from "../types";

export function handleAction<Args extends unknown[], T>(
  action: (...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<ActionResult<T>> => {
    try {
      const data = await action(...args);

      return {
        success: true,
        data,
        error: null,
      };
    } catch (error) {
      console.error("Error:", error);
      const err =
        error instanceof DrizzleQueryError
          ? { message: "Unexpected error occurred. Please try again." }
          : { message: (error as Error).message || "Something went wrong." };

      return {
        success: false,
        data: null,
        error: err,
      };
    }
  };
}
