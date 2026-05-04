import { useAuth } from "@/app/providers/AuthProvider"
import PageAccount from "../ui/PageAccount"

export default function PageAccountFeature() {
  const { driver, logout, isDeletingRefreshToken } = useAuth()

  return (
    <PageAccount
      driver={driver}
      onLogout={logout}
      isDeletingRefreshToken={isDeletingRefreshToken}
    />
  )
}
