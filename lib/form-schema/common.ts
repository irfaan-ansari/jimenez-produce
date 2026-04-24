import z from "zod";

export const phoneSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, "")) // keep digits only
  .refine((val) => val.length === 10, {
    message: "Phone must be 10 digits",
  });
