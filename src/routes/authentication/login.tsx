import PageLoginFeature from "@/pages/authentication/feature/PageLoginFeature"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute("/authentication/login")({
  component: PageLoginFeature,
  validateSearch: searchSchema,
})
