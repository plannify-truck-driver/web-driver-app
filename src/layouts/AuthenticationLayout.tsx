import { LanguageThemeSettings } from "@/shared/components/LanguageThemeSettings"
import { Outlet } from "@tanstack/react-router"

export default function AuthenticationLayout() {
  return (
    <div className="bg-gradient-auth flex h-screen flex-col items-center justify-center">
      <svg width="100%" height="100%" className="absolute top-0 left-0 z-0">
        <defs>
          <pattern id="smallSquares" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="5" y="5" width="2" height="2" fill="white" fillOpacity="0.5"></rect>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#smallSquares)"></rect>
      </svg>
      <div className="sm:bg-background/20 z-10 h-full w-full sm:h-auto sm:w-auto sm:max-w-[800px] sm:min-w-[480px] sm:rounded-[25px] sm:border-[1.5px] sm:border-dashed sm:border-white/20 sm:p-[18.5px] sm:shadow-xl">
        <div className="bg-background flex h-full w-full flex-col gap-6 p-8 sm:h-auto sm:justify-center sm:rounded-[20px] sm:shadow-md">
          <div className="flex justify-end sm:absolute sm:top-2 sm:right-2 sm:z-20">
            <LanguageThemeSettings />
          </div>
          <img src="/logo.png" alt="Logo" className="mx-auto h-auto w-full max-w-[200px]" />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
