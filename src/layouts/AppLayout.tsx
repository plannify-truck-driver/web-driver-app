import { useAuth } from "@/app/providers/useAuth"
import { useTheme } from "@/app/providers/useTheme"
import { useShareBannerDismiss } from "@/hooks/use-share-banner-dismiss"
import { Loader } from "@/shared/components/Loader"
import { ShareBanner } from "@/shared/components/ShareBanner"
import { Button } from "@/shared/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/Sidebar"
import { useSidebar } from "@/shared/components/ui/useSidebar"
import { cn } from "@/lib/utils"
import { Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router"
import {
  CalendarSearch,
  Check,
  ChevronsDownUp,
  ChevronsUpDown,
  Earth,
  FileText,
  Laptop,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sun,
  Truck,
  User,
  type LucideIcon,
} from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { usePwaUpdate } from "@/app/providers/usePwaUpdate"
import { useChangeLanguage } from "@/shared/lib/useChangeLanguage"

interface NavbarNavigationItem {
  title: string
  navigationTitle: {
    mobile: string
    desktop: string
  }
  icon: LucideIcon
  link: string
}

export default function AppLayout() {
  const { driver, logout, isDeletingRefreshToken } = useAuth()
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const { open, toggleSidebar } = useSidebar()
  const { isVisible: isShareBannerVisible, dismiss: dismissShareBanner } = useShareBannerDismiss()
  const { needRefresh } = usePwaUpdate()
  const changeLanguage = useChangeLanguage()
  const hasAccountAlert = needRefresh || !!driver?.deactivation_planned_at

  const navigationItems: NavbarNavigationItem[] = [
    {
      title: "navigation.dashboard.title",
      navigationTitle: {
        mobile: "navigation.dashboard.navigation-title.mobile",
        desktop: "navigation.dashboard.navigation-title.desktop",
      },
      icon: Truck,
      link: "/dashboard",
    },
    {
      title: "navigation.workdays.title",
      navigationTitle: {
        mobile: "navigation.workdays.navigation-title.mobile",
        desktop: "navigation.workdays.navigation-title.desktop",
      },
      icon: CalendarSearch,
      link: "/workdays",
    },
    {
      title: "navigation.documents.title",
      navigationTitle: {
        mobile: "navigation.documents.navigation-title.mobile",
        desktop: "navigation.documents.navigation-title.desktop",
      },
      icon: FileText,
      link: "/documents",
    },
    {
      title: "navigation.account.title",
      navigationTitle: {
        mobile: "navigation.account.navigation-title.mobile",
        desktop: "navigation.account.navigation-title.desktop",
      },
      icon: User,
      link: "/account",
    },
  ]

  const navigate = useNavigate()
  const location = useLocation()

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false)

  if (!driver) return null

  function toUpperCaseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const previousMonthDate = new Date()
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1)
  const previousMonth = previousMonthDate.toLocaleString(i18n.language, { month: "long" })
  const yearFromPreviousMonth = previousMonthDate.getFullYear()

  const currentYear = new Date().getFullYear()
  const previousYear = currentYear - 1

  return (
    <>
      {/* For desktop screens */}
      <div className="hidden h-full w-full flex-row sm:flex">
        <Sidebar side="left" variant="sidebar" collapsible="icon" className="hidden sm:block">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem className="flex w-full justify-center">
                <Link to="/dashboard" className="text-responsive-base!">
                  {open ? (
                    <img src="/logo.png" alt="Logo" className="h-auto w-full max-w-[180px]" />
                  ) : (
                    <img src="/logo-small.png" alt="Small logo" className="h-auto w-8" />
                  )}
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent className="mt-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive =
                      location.pathname.startsWith(item.link) ||
                      (item.link === "/account" && location.pathname.startsWith("/settings"))
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          variant="navigation"
                          size="navigation"
                          isActive={isActive}
                        >
                          <Link to={item.link}>
                            <div className="relative">
                              <item.icon size={20} />
                              {item.link === "/account" && hasAccountAlert && (
                                <span
                                  className={cn(
                                    "ring-sidebar absolute -top-1 -right-1 h-2 w-2 rounded-full ring-2",
                                    driver?.deactivation_planned_at ? "bg-red-500" : "bg-primary"
                                  )}
                                />
                              )}
                            </div>
                            <span>
                              {toUpperCaseFirstLetter(
                                t(item.navigationTitle.desktop, {
                                  currentYear,
                                  previousYear,
                                  previousMonth,
                                  yearFromPreviousMonth,
                                })
                              )}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {open && isShareBannerVisible && (
              <SidebarGroup className="mt-auto">
                <SidebarGroupContent>
                  <ShareBanner variant="sidebar" onDismiss={dismissShareBanner} />
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex flex-row items-center gap-2"
                    >
                      <span className="bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm font-medium">
                        {(driver.first_name.at(0) ?? "").toUpperCase() +
                          (driver.last_name.at(0) ?? "").toUpperCase()}
                      </span>
                      <div className="w-ull flex h-full flex-col justify-between">
                        <p className="line-clamp-1 w-full p-0 leading-none">{driver.first_name}</p>
                        <p className="line-clamp-1 w-full p-0 leading-none">{driver.last_name}</p>
                      </div>
                      {isUserModalOpen ? (
                        <ChevronsDownUp className="ml-auto size-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto size-4" />
                      )}
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side="top"
                    align="start"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="grid flex-1 px-1 py-1.5 text-left leading-tight">
                        <span className="text-responsive-base truncate font-medium">
                          {driver.first_name} {driver.last_name}
                        </span>
                        <span className="text-muted-foreground text-responsive-sm truncate">
                          {driver.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-responsive-base!">
                        {theme === "light" ? (
                          <Sun className="size-4" />
                        ) : theme === "dark" ? (
                          <Moon className="size-4" />
                        ) : (
                          <Laptop className="size-4" />
                        )}
                        {t("themes.title")}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {["light", "dark", "system"].map((themeOption) => (
                            <DropdownMenuItem
                              key={themeOption}
                              onClick={() => setTheme(themeOption as "light" | "dark" | "system")}
                              className="text-responsive-base!"
                            >
                              {t(`themes.${themeOption}`)}
                              {theme === themeOption && <Check className="ml-auto size-4" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-responsive-base!">
                        <Earth className="size-4" />
                        {t("languages.title")}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {Array.isArray(i18n.options.supportedLngs)
                            ? i18n.options.supportedLngs
                                .filter(
                                  (lng) =>
                                    import.meta.env.VITE_ENV == "development" || lng !== "cimode"
                                )
                                .map((lng) => (
                                  <DropdownMenuItem
                                    onClick={() => changeLanguage(lng)}
                                    className="text-responsive-base!"
                                    key={lng}
                                  >
                                    {t(`languages.${lng}`)}
                                    {i18n.language === lng && <Check className="ml-auto size-4" />}
                                  </DropdownMenuItem>
                                ))
                            : null}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/settings/application-preferences"
                        className="text-responsive-base!"
                      >
                        <Settings className="size-4" />
                        {t("settings")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        if (isDeletingRefreshToken) return

                        logout()
                        navigate({ to: "/authentication/login" })
                      }}
                      className={
                        isDeletingRefreshToken
                          ? "text-responsive-base! cursor-not-allowed opacity-50"
                          : "text-responsive-base!"
                      }
                    >
                      <LogOut className="size-4" />
                      {t("logout")}
                      {isDeletingRefreshToken && <Loader size={4} />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="bg-background hidden w-full flex-col gap-2 sm:flex">
          <div className="border-muted flex w-full flex-row border-b px-2">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="size-7">
              {open ? <PanelLeftClose /> : <PanelLeftOpen />}
            </Button>
          </div>
          <div className="h-full overflow-y-auto">
            <div className="px-4 pb-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      {/* For mobile screens */}
      <div className="bg-background flex h-full w-full flex-col justify-between sm:hidden">
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-2 pb-4">
            <Outlet />
          </div>
        </div>
        <div className="bg-sidebar border-muted flex flex-row justify-between gap-2 border-t px-6 pt-2 pb-[calc(0.5rem_+_env(safe-area-inset-bottom))]">
          {navigationItems.map((item) => {
            const isActive =
              location.pathname.startsWith(item.link) ||
              (item.link === "/account" && location.pathname.startsWith("/settings"))
            return (
              <Link
                key={item.title}
                to={item.link}
                className={
                  "flex flex-col items-center" + (isActive ? "" : " text-muted-foreground")
                }
              >
                <div className="relative">
                  <item.icon strokeWidth={1.5} size={26} />
                  {item.link === "/account" && hasAccountAlert && (
                    <span
                      className={cn(
                        "ring-sidebar absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2",
                        driver?.deactivation_planned_at ? "bg-red-500" : "bg-primary"
                      )}
                    />
                  )}
                </div>
                <p className="text-responsive-md p-0 leading-none">
                  {t(item.navigationTitle.mobile)}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
