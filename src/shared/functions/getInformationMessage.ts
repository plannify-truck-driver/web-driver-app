import type { Information } from "@/shared/queries/informations/informations.types"

export const getInformationMessage = (
  information: Information,
  language: string
): string | null => {
  if (!information.message) return null

  const lang = language.split("-")[0].toLowerCase()
  const message = information.message[lang] ?? information.message.en ?? null

  return message?.replaceAll("\\n", "\n") ?? null
}
