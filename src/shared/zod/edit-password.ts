import z from "zod"

export const editPasswordFormSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(12, { message: "validation.password.min-length" })
      .max(50, { message: "validation.password.max-length" }),
    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: "validation.confirm-password.required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.confirm-password.match",
    path: ["confirmPassword"],
  })
