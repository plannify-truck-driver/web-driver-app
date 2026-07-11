import { LanguageThemeSettings } from "@/shared/components/LanguageThemeSettings"
import { Outlet } from "@tanstack/react-router"
import { LifeBuoyIcon } from "lucide-react"
import { useState } from "react"

export default function AuthenticationLayout() {
  const [showSettings, setShowSettings] = useState(false)

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
            <div className="flex flex-col items-end gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => setShowSettings((v) => !v)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted size-8 rounded-full text-sm font-medium transition-colors"
              >
                <LifeBuoyIcon className="h-5 w-5" />
              </button>
              {showSettings && <LanguageThemeSettings />}
            </div>
            <div className="hidden sm:flex">
              <LanguageThemeSettings />
            </div>
          </div>
          <img src="/logo.png" alt="Logo" className="mx-auto h-auto w-full max-w-[200px]" />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
