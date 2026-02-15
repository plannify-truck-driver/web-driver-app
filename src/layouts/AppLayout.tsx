import { useAuth } from "@/app/providers/AuthProvider"
import { useTheme } from "@/app/providers/ThemeProvider"
import { Button } from "@/shared/components/ui/Button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/Collapsible"
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/Sidebar"
import { Link, Outlet, useNavigate } from "@tanstack/react-router"
import {
  CalendarSearch,
  Check,
  ChevronDown,
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
} from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function AppLayout() {
  const { driver, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const { open, toggleSidebar } = useSidebar()

  const navigate = useNavigate()

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false)

  if (!driver) return null

  const now: Date = new Date()

  return (
    <>
      {/* For desktop screens */}
      <div className="hidden h-screen w-screen flex-row sm:flex">
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
          <SidebarContent>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <div className="flex w-full flex-row items-center justify-between">
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">
                      <Truck /> {t("navigation.dashboard.title")}
                    </Link>
                  </Button>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                      <ChevronDown className="ml-auto cursor-pointer transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                </div>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.dashboard.start-workday")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.dashboard.end-workday")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.dashboard.configure-rest-periods")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
            <Collapsible className="group/collapsible">
              <SidebarGroup>
                <div className="flex w-full flex-row items-center justify-between">
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">
                      <CalendarSearch /> {t("navigation.workdays.title")}
                    </Link>
                  </Button>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                      <ChevronDown className="ml-auto cursor-pointer transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                </div>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.workdays.view-workdays-current-month")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.workdays.view-workdays-previous-month")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.workdays.view-workdays-custom")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.workdays.add-workday")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.workdays.view-garbage-workdays")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
            <Collapsible className="group/collapsible">
              <SidebarGroup>
                <div className="flex w-full flex-row items-center justify-between">
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">
                      <FileText /> {t("navigation.documents.title")}
                    </Link>
                  </Button>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                      <ChevronDown className="ml-auto cursor-pointer transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                </div>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>
                              {t("navigation.documents.view-documents-year", {
                                year: now.getFullYear(),
                              })}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>
                              {t("navigation.documents.view-documents-year", {
                                year: now.getFullYear() - 1,
                              })}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
            <Collapsible className="group/collapsible">
              <SidebarGroup>
                <div className="flex w-full flex-row items-center justify-between">
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">
                      <User /> {t("navigation.account.title")}
                    </Link>
                  </Button>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                      <ChevronDown className="ml-auto cursor-pointer transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                </div>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.account.view-my-informations")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.account.view-my-mails")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/dashboard">
                            <span>{t("navigation.account.update-notification-preferences")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
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
                      <p className="bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm font-medium">
                        {(driver.first_name.at(0) ?? "").toUpperCase() +
                          (driver.last_name.at(0) ?? "").toUpperCase()}
                      </p>
                      <div className="w-ull flex h-full flex-col justify-between">
                        <p className="line-clamp-1 w-full p-0 leading-none">{driver.first_name}</p>
                        <p className="line-clamp-1 w-full p-0 leading-none">
                          {driver.last_name.toUpperCase()}
                        </p>
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
                                    onClick={() => i18n.changeLanguage(lng)}
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
                      <Link to="/" className="text-responsive-base!">
                        <Settings className="size-4" />
                        {t("settings")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout()
                        navigate({ to: "/authentication/login" })
                      }}
                      className="text-responsive-base!"
                    >
                      <LogOut className="size-4" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="hidden w-full flex-col gap-2 sm:flex">
          <div className="border-muted flex w-full flex-row border-b px-2">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="size-7">
              {open ? <PanelLeftClose /> : <PanelLeftOpen />}
            </Button>
          </div>
          <div className="pl-2">
            <Outlet />
          </div>
        </div>
      </div>
      {/* For mobile screens */}
      <div className="flex h-[100dvh] w-screen flex-col justify-between sm:hidden">
        <div className="h-full px-2">
          <Outlet />
        </div>
        <div className="border-muted flex flex-row justify-between gap-2 border-t px-3 py-2">
          <Link to="/dashboard">
            <div className="flex flex-col items-center">
              <Truck strokeWidth={1.5} size={26} />
              <p className="p-0 leading-none">{t("navigation.dashboard.title")}</p>
            </div>
          </Link>
          <Link to="/">
            <div className="flex flex-col items-center">
              <CalendarSearch strokeWidth={1.5} size={26} />
              <p className="p-0 leading-none">{t("navigation.workdays.title")}</p>
            </div>
          </Link>
          <Link to="/">
            <div className="flex flex-col items-center">
              <FileText strokeWidth={1.5} size={26} />
              <p className="p-0 leading-none">{t("navigation.documents.title")}</p>
            </div>
          </Link>
          <Link to="/">
            <div className="flex flex-col items-center">
              <User strokeWidth={1.5} size={26} />
              <p className="p-0 leading-none">{t("navigation.account.title")}</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
