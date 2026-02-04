import { Earth, Laptop, Moon, Sun } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/Select"
import { useTheme } from "@/app/providers/ThemeProvider"
import { useTranslation } from "react-i18next"

export function LanguageThemeSettings() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-row gap-2">
      <Select
        defaultValue={i18n.language.split("-")[0].toLowerCase()}
        onValueChange={(lng) => i18n.changeLanguage(lng)}
      >
        <SelectTrigger className="bg-background w-full max-w-48">
          <Earth className="mr-2 inline h-4 w-4" />
          <SelectValue placeholder={t("languages.input-placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("languages.title")}</SelectLabel>
            {Array.isArray(i18n.options.supportedLngs)
              ? i18n.options.supportedLngs
                  .filter((lng) => import.meta.env.VITE_ENV == "development" || lng !== "cimode")
                  .map((lng) => (
                    <SelectItem key={lng} value={lng}>
                      {t(`languages.${lng}`)}
                    </SelectItem>
                  ))
              : null}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        defaultValue={theme}
        onValueChange={(value: "light" | "dark" | "system") => setTheme(value)}
      >
        <SelectTrigger className="bg-background w-full max-w-48">
          {theme === "light" ? (
            <Sun className="mr-2 inline h-4 w-4" />
          ) : theme === "dark" ? (
            <Moon className="mr-2 inline h-4 w-4" />
          ) : (
            <Laptop className="mr-2 inline h-4 w-4" />
          )}

          <SelectValue placeholder={t("themes.input-placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("themes.title")}</SelectLabel>
            {["light", "dark", "system"].map((themeOption) => (
              <SelectItem key={themeOption} value={themeOption}>
                {t(`themes.${themeOption}`)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
