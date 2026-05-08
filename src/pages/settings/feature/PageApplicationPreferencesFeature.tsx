import { useShowSeconds } from "@/hooks/use-show-seconds"
import { useMaxWorkdayDuration } from "@/hooks/use-max-workday-duration"
import PageApplicationPreferences from "../ui/PageApplicationPreferences"

export default function PageApplicationPreferencesFeature() {
  const { showSeconds, setShowSeconds } = useShowSeconds()
  const { maxHours, setMaxHours } = useMaxWorkdayDuration()

  return (
    <PageApplicationPreferences
      showSeconds={showSeconds}
      onShowSecondsChange={setShowSeconds}
      maxHours={maxHours}
      onMaxHoursChange={setMaxHours}
    />
  )
}
