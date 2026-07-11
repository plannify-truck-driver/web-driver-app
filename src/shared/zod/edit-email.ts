import z from "zod"

export const editEmailFormSchema = z.object({
  email: z
    .email({ message: "validation.email.invalid" })
    .trim()
    .min(1, { message: "validation.email.required" })
    .max(255, { message: "validation.email.max-length" }),
})
