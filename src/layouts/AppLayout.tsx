import { Outlet } from "@tanstack/react-router"

export default function AppLayout() {
  return (
    <div className="background-gray-100 flex h-screen w-screen">
      <Outlet />
    </div>
  )
}
