import { useMutation } from "@tanstack/react-query"
import { login } from "./auth.api"

export const useLoginMutation = () =>
  useMutation({
    mutationFn: login,
  })
