import { z } from "zod";

// Accepts either an email address or a phone number in the same field.
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone number is required"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
