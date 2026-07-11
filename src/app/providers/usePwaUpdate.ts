import { useContext } from "react"
import { PwaUpdateContext } from "./PwaUpdateProviderContext"

export function usePwaUpdate() {
  return useContext(PwaUpdateContext)
}
