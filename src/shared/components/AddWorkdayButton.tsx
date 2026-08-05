import { cn } from "@/lib/utils"
import { ChevronRightIcon, PlusIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

interface AddWorkdayButtonProps {
  isFirstWorkday: boolean
  className?: string
  disabled?: boolean
  onClick: () => void
}

export function AddWorkdayButton({
  isFirstWorkday,
  className,
  disabled = false,
  onClick,
}: AddWorkdayButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "cursor-pointer rounded-lg border border-dashed px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-md">
            <PlusIcon size={18} className="text-primary" />
          </div>
          <div className="flex flex-col items-start justify-between">
            <p className="text-sm font-semibold">
              {isFirstWorkday
                ? t("components.add-workday-button.add-first-workday")
                : t("components.add-workday-button.add-another-workday")}
            </p>
            <span className="text-muted-foreground text-xs">
              {t("components.add-workday-button.manual-add-workday")}
            </span>
          </div>
        </div>
        <ChevronRightIcon size={18} className="text-muted-foreground" />
      </div>
    </button>
  )
}
