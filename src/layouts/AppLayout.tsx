import { Outlet } from "@tanstack/react-router"

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <Outlet />
    </div>
  )
}
