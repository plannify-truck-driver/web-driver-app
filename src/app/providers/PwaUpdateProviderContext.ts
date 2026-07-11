import { createContext } from "react"

export interface PwaUpdateContextValue {
  needRefresh: boolean
  updateServiceWorker: () => Promise<void>
}

export const PwaUpdateContext = createContext<PwaUpdateContextValue>({
  needRefresh: false,
  updateServiceWorker: async () => {},
})
