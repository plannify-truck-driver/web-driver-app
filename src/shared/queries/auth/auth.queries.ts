import { useMutation, useQuery } from "@tanstack/react-query"
import { login, refreshToken, registration, verifyAccount } from "./auth.api"

export const authKeys = {
  all: [] as const,
  refreshToken: () => [...authKeys.all, "refreshToken"] as const,
}

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

export const useRefreshToken = () =>
  useQuery({
    queryKey: authKeys.refreshToken(),
    queryFn: refreshToken,
    enabled: false,
  })