import { DrizzleQueryError } from "drizzle-orm";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export const asyncHandler =
  <T extends (...args: any[]) => Promise<any>>(fn: T) =>
  async (
    ...args: Parameters<T>
  ): Promise<ActionResult<Awaited<ReturnType<T>>>> => {
    try {
      const data = await fn(...args);

      return data;
    } catch (error: unknown) {
      console.error("Unhandled Error:", error);

      if (error instanceof DrizzleQueryError) {
        throw new Error("Internal server error");
      }

      if (error instanceof Error) throw error;

      throw new Error("Internal server error");
    }
  };
