import { useTranslation } from "react-i18next"

export default function PageLogin() {
  const { i18n } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      <p>
        {Array.isArray(i18n.options.supportedLngs) ? i18n.options.supportedLngs.join(", ") : ""}
      </p>
    </div>
  )
}
