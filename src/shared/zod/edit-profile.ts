import z from "zod"

export const editProfileFormSchema = z.object({
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
  gender: z.enum(["M", "F", "O"]).nullable().optional(),
  phone_number: z
    .string()
    .trim()
    .max(30, { message: "validation.phone-number.max-length" })
    .nullable()
    .optional(),
})
