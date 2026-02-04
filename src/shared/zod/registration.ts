import z from "zod"

export const registrationFormSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, { message: "validation.firstname.required" })
    .max(255, { message: "validation.firstname.max-length" }),
  lastname: z
    .string()
    .trim()
    .min(1, { message: "validation.lastname.required" })
    .max(255, { message: "validation.lastname.max-length" }),
  gender: z.string().trim().min(1, { message: "validation.gender.required" }),
  email: z
    .email({ message: "validation.email.invalid" })
    .trim()
    .min(1, { message: "validation.email.required" })
    .max(255, { message: "validation.email.max-length" }),
  password: z
    .string()
    .trim()
    .min(12, { message: "validation.password.min-length" })
    .max(50, { message: "validation.password.max-length" }),
  confirmPassword: z.string().trim().min(1, { message: "validation.confirm-password.required" }),
})
