import { Loader } from "@/shared/components/Loader"
import { Button } from "@/shared/components/ui/Button"
import { useNavigate } from "@tanstack/react-router"
import { TriangleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"

interface PageVerifyAccountProps {
  message: { success: string; error: string } | null
  loading: boolean
}

export default function PageVerifyAccount({ message, loading }: PageVerifyAccountProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="text-muted-foreground inline text-sm">
        {t("pages.authentication.token-verify-account.description")}
      </p>
      {message?.error && (
        <div className="text-warning flex flex-row gap-2">
          <TriangleAlert />
          <p>{message.error}</p>
        </div>
      )}
      {loading && <Loader />}
      {message?.success && (
        <div className="flex flex-col gap-3">
          <p>{message.success}</p>
          <div className="flex justify-center">
            <Button onClick={() => navigate({ to: "/dashboard" })} className="w-full sm:w-auto">
              {t("pages.authentication.token-verify-account.access-account-button")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
