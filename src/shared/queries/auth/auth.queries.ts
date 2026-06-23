import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query"
import {
  confirmResetPassword,
  deleteRefreshToken,
  getRegistrationLimitation,
  login,
  refreshToken,
  registration,
  resetPassword,
  verifyAccount,
} from "./auth.api"

export const authKeys = {
  all: [] as const,
  refreshToken: () => [...authKeys.all, "refreshToken"] as const,
}

export const useLoginMutation = (options?: UseMutationOptions<Awaited<ReturnType<typeof login>>, Error, Parameters<typeof login>[0]>) =>
  useMutation({ mutationFn: login, ...options })

export const useRegistrationMutation = (options?: UseMutationOptions<Awaited<ReturnType<typeof registration>>, Error, Parameters<typeof registration>[0]>) =>
  useMutation({ mutationFn: registration, ...options })

export const useVerifyAccountMutation = (options?: UseMutationOptions<Awaited<ReturnType<typeof verifyAccount>>, Error, Parameters<typeof verifyAccount>[0]>) =>
  useMutation({ mutationFn: verifyAccount, ...options })

export const useRefreshToken = () =>
  useQuery({
    queryKey: authKeys.refreshToken(),
    queryFn: refreshToken,
    enabled: false,
    retry: false,
  })

export const useDeleteRefreshTokenMutation = () =>
  useMutation({
    mutationFn: deleteRefreshToken,
  })

export const useResetPasswordMutation = (options?: UseMutationOptions<void, Error, Parameters<typeof resetPassword>[0]>) =>
  useMutation({
    mutationFn: resetPassword,
    ...options,
  })

export const useConfirmResetPasswordMutation = (options?: UseMutationOptions<Awaited<ReturnType<typeof confirmResetPassword>>, Error, Parameters<typeof confirmResetPassword>[0]>) =>
  useMutation({ mutationFn: confirmResetPassword, ...options })

export const useRegistrationLimitationQuery = () =>
  useQuery({
    queryKey: ["registrationLimitation"],
    queryFn: getRegistrationLimitation,
    gcTime: 0,
    staleTime: 0,
    retry: false,
  })
