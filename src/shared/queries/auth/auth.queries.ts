import { useMutation } from "@tanstack/react-query"
import { login, registration, verifyAccount } from "./auth.api"

export const useLoginMutation = () =>
  useMutation({
    mutationFn: login,
  })

export const useRegistrationMutation = () =>
  useMutation({
    mutationFn: registration,
  })

export const useVerifyAccountMutation = () =>
  useMutation({
    mutationFn: verifyAccount,
  })
