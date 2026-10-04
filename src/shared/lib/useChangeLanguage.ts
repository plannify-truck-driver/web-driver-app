import { updateMe } from "@/shared/queries/driver/driver.api"
import { useTranslation } from "react-i18next"

export function useChangeLanguage() {
  const { i18n } = useTranslation()

  return (lng: string) => {
    i18n.changeLanguage(lng)
    updateMe({ language: lng }).catch(() => {})
  }
}
