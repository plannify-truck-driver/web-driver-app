import z from "zod"

export const loginFormSchema = z.object({
  email: z
    .email({ message: "validation.email.invalid" })
    .trim()
    .min(1, { message: "validation.email.required" }),
  password: z.string().trim().min(1, { message: "validation.password.required" }),
})
