import { useSyncExternalStore } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const standaloneQuery = window.matchMedia("(display-mode: standalone)")

let deferredPrompt: BeforeInstallPromptEvent | null = null
let isInstalled =
  standaloneQuery.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

// Registered at module load (imported from main.tsx): the event can fire before React mounts
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
  notify()
})

window.addEventListener("appinstalled", () => {
  deferredPrompt = null
  isInstalled = true
  notify()
})

standaloneQuery.addEventListener("change", (event) => {
  isInstalled = event.matches
  notify()
})

// iOS has no install prompt: the user must use "Add to Home Screen" from the share menu.
// iPadOS reports itself as a Mac, hence the touch points check.
const isIos =
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1)

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

async function install() {
  if (!deferredPrompt) return
  await deferredPrompt.prompt()
  await deferredPrompt.userChoice
  // A prompt can only be used once
  deferredPrompt = null
  notify()
}

export function usePwaInstall() {
  const canPrompt = useSyncExternalStore(subscribe, () => deferredPrompt !== null)
  const installed = useSyncExternalStore(subscribe, () => isInstalled)

  return {
    isInstalled: installed,
    canPrompt,
    isIos,
    // Browsers without prompt support (Firefox desktop...) cannot install the app: hide the banner
    isInstallable: !installed && (canPrompt || isIos),
    install,
  }
}
