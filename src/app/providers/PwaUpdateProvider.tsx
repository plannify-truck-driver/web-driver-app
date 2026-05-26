import { createContext, useContext, type ReactNode } from "react"
import { useRegisterSW } from "virtual:pwa-register/react"

interface PwaUpdateContextValue {
  needRefresh: boolean
  updateServiceWorker: () => Promise<void>
}

const PwaUpdateContext = createContext<PwaUpdateContextValue>({
  needRefresh: false,
  updateServiceWorker: async () => {},
})

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

export function usePwaUpdate() {
  return useContext(PwaUpdateContext)
}
