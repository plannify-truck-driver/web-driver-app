import { z } from "zod"

export const endWorkdayRestSchema = z.object({
  restMins: z.number().int().min(0).max(720),
  overnightRest: z.boolean(),
})
