import z from "zod"

export const addWorkdayFormSchema = z.object({
  date: z.date({ message: "validation.date.invalid" }),
  startTime: z.string().trim().min(1, { message: "validation.start-time.required" }),
  endTime: z.string().optional(),
  restTime: z.string().trim().min(1, { message: "validation.rest-time.required" }).optional(),
  overnight: z.boolean(),
})
