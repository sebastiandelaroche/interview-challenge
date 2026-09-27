import { z } from "zod";

export const reserveSchema = (available: number) =>
  z.object({
    ticketsQuantity: z
      .number({ error: "Quantity is required" })
      .int("Must be a whole number")
      .positive("Must be at least 1")
      .max(available, `Only ${available} tickets available`),
    customerFullName: z.string().trim().min(1, "Name is required"),
    customerEmail: z.email("Enter a valid email"),
  });

export type ReserveFormValues = z.infer<ReturnType<typeof reserveSchema>>;
