import type { ReactNode } from "react"
import { useRegisterSW } from "virtual:pwa-register/react"
import { PwaUpdateContext } from "./PwaUpdateProviderContext"

export function PwaUpdateProvider({ children }: { children: ReactNode }) {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  return (
    <PwaUpdateContext.Provider value={{ needRefresh, updateServiceWorker }}>
      {children}
    </PwaUpdateContext.Provider>
  )
}
