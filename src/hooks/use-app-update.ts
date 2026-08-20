import { usePwaUpdate } from "@/app/providers/usePwaUpdate"
import { useUpdates } from "@/shared/queries/updates/updates.queries"

export function useAppUpdate() {
  const { needRefresh, updateServiceWorker } = usePwaUpdate()
  const { data: updatesData } = useUpdates({
    version: import.meta.env.VITE_VERSION,
    limit: 10,
    page: 1,
  })

  const changelog = updatesData?.data ?? []
  const isUpdateAvailable = needRefresh || changelog.length > 0

  const applyUpdate = () => {
    if (needRefresh) {
      updateServiceWorker()
    } else {
      window.location.reload()
    }
  }

  return { isUpdateAvailable, changelog, applyUpdate }
}
