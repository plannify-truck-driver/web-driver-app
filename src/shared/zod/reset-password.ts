import z from "zod"

export const resetPasswordFormSchema = z.object({
  email: z
    .email({ message: "validation.email.invalid" })
    .trim()
    .min(1, { message: "validation.email.required" }),
})
