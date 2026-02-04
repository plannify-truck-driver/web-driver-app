import { useTheme } from "@/app/providers/ThemeProvider"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select"
import { Outlet } from "@tanstack/react-router"
import { Earth, Laptop, Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function AuthenticationLayout() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <div className="bg-gradient-auth flex h-screen flex-col items-center justify-center">
      <svg width="100%" height="100%" className="absolute top-0 left-0 z-0">
        <defs>
          <pattern id="smallSquares" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="5" y="5" width="2" height="2" fill="white" fillOpacity="0.5"></rect>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#smallSquares)"></rect>
      </svg>
      <div className="absolute top-2 right-2 z-20 flex flex-row gap-2">
        <Select defaultValue={i18n.language} onValueChange={(lng) => i18n.changeLanguage(lng)}>
          <SelectTrigger className="bg-background w-full max-w-48">
            <Earth className="mr-2 inline h-4 w-4" />
            <SelectValue placeholder={t("languages.input-placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("languages.title")}</SelectLabel>
              {Array.isArray(i18n.options.supportedLngs)
                ? i18n.options.supportedLngs.map((lng) => (
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
      <div className="sm:bg-background/20 z-10 h-full w-full sm:h-auto sm:w-auto sm:max-w-[800px] sm:min-w-[480px] sm:rounded-[25px] sm:border-[1.5px] sm:border-dashed sm:border-white/20 sm:p-[18.5px] sm:shadow-xl">
        <div className="bg-background flex h-full w-full flex-col justify-center gap-6 p-8 sm:h-auto sm:rounded-[20px] sm:shadow-md">
          <img src="/logo-small.png" alt="Logo" className="mx-auto h-12 w-auto" />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
