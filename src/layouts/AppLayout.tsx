import { useAuth } from "@/app/providers/AuthProvider"
import { useTheme } from "@/app/providers/ThemeProvider"
import { Loader } from "@/shared/components/Loader"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/shared/components/ui/Sidebar"
import { Link, Outlet, useNavigate } from "@tanstack/react-router"
import {
  CalendarSearch,
  Check,
  ChevronDown,
  ChevronRight,
  // ChevronDown,
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
import { toast } from "sonner"

interface NavbarNavigationItem {
  title: string
  navigationTitle: {
    mobile: string
    desktop: string
  }
  icon: LucideIcon
  link: string
  subItems: {
    title: {
      mobile: string | null
      desktop: string
    }
    action: string | (() => void)
  }[]
}

export default function AppLayout() {
  const { driver, logout, isDeletingRefreshToken } = useAuth()
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const { open, toggleSidebar } = useSidebar()

  const navigate = useNavigate()

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState<{ [key: string]: boolean }>({})

  if (!driver) return null

  function toUpperCaseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const navigationItems: NavbarNavigationItem[] = [
    {
      title: "navigation.dashboard.title",
      navigationTitle: {
        mobile: "navigation.dashboard.navigation-title.mobile",
        desktop: "navigation.dashboard.navigation-title.desktop",
      },
      icon: Truck,
      link: "/dashboard",
      subItems: [
        {
          title: {
            mobile: null,
            desktop: "navigation.dashboard.start-workday",
          },
          action: () => toast.info("Fonctionnalité à venir"),
        },
        {
          title: {
            mobile: null,
            desktop: "navigation.dashboard.end-workday",
          },
          action: () => toast.info("Fonctionnalité à venir"),
        },
        {
          title: {
            mobile: null,
            desktop: "navigation.dashboard.configure-rest-periods",
          },
          action: "/dashboard/configure-rest-periods",
        },
      ],
    },
    {
      title: "navigation.workdays.title",
      navigationTitle: {
        mobile: "navigation.workdays.navigation-title.mobile",
        desktop: "navigation.workdays.navigation-title.desktop",
      },
      icon: CalendarSearch,
      link: "/workdays",
      subItems: [
        {
          title: {
            mobile: "navigation.workdays.view-workdays-current-month.mobile",
            desktop: "navigation.workdays.view-workdays-current-month.desktop",
          },
          action: "/workdays",
        },
        {
          title: {
            mobile: "navigation.workdays.view-workdays-previous-month.mobile",
            desktop: "navigation.workdays.view-workdays-previous-month.desktop",
          },
          action: "/workdays/previous-month",
        },
        {
          title: {
            mobile: "navigation.workdays.view-workdays-custom.mobile",
            desktop: "navigation.workdays.view-workdays-custom.desktop",
          },
          action: "/workdays/custom",
        },
        {
          title: { mobile: null, desktop: "navigation.workdays.add-workday" },
          action: () => toast.info("Fonctionnalité à venir"),
        },
        {
          title: { mobile: null, desktop: "navigation.workdays.view-garbage-workdays" },
          action: "/workdays/garbage",
        },
      ],
    },
    {
      title: "navigation.documents.title",
      navigationTitle: {
        mobile: "navigation.documents.navigation-title.mobile",
        desktop: "navigation.documents.navigation-title.desktop",
      },
      icon: FileText,
      link: "/documents",
      subItems: [
        {
          title: {
            mobile: null,
            desktop: "navigation.documents.view-documents-year",
          },
          action: "/documents/current-year",
        },
        {
          title: {
            mobile: null,
            desktop: "navigation.documents.view-documents-previous-year",
          },
          action: "/documents/previous-year",
        },
        {
          title: {
            mobile: null,
            desktop: "navigation.documents.view-documents-custom",
          },
          action: "/documents/custom",
        },
      ],
    },
    {
      title: "navigation.account.title",
      navigationTitle: {
        mobile: "navigation.account.navigation-title.mobile",
        desktop: "navigation.account.navigation-title.desktop",
      },
      icon: User,
      link: "/account",
      subItems: [
        {
          title: {
            mobile: null,
            desktop: "navigation.account.view-my-informations",
          },
          action: "/account/informations",
        },
        {
          title: {
            mobile: null,
            desktop: "navigation.account.view-my-mails",
          },
          action: "/account/mails",
        },
        {
          title: {
            mobile: null,
            desktop: "navigation.account.update-notification-preferences",
          },
          action: "/account/notification-preferences",
        },
      ],
    },
  ]

  const currentMonth = new Date().toLocaleString(i18n.language, { month: "long" })
  const previousMonthDate = new Date()
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1)
  const previousMonth = previousMonthDate.toLocaleString(i18n.language, { month: "long" })
  const yearFromPreviousMonth = previousMonthDate.getFullYear()

  const currentYear = new Date().getFullYear()
  const previousYear = currentYear - 1

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
            <SidebarGroup>
              <SidebarGroupLabel>Conducteur</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className={open ? "pl-2" : ""}>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {!open ? (
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.link}
                            className="flex cursor-pointer flex-row items-center gap-2"
                          >
                            {<item.icon size={20} />}
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <Collapsible className="group/collapsible">
                          <div className="flex flex-row items-center justify-between">
                            <SidebarMenuButton asChild>
                              <Link
                                to={item.link}
                                className="flex cursor-pointer flex-row items-center gap-2"
                              >
                                {<item.icon size={20} />}
                                <span>
                                  {toUpperCaseFirstLetter(
                                    t(item.navigationTitle.desktop, {
                                      currentMonth,
                                      currentYear,
                                      previousYear,
                                      previousMonth,
                                      yearFromPreviousMonth,
                                    })
                                  )}
                                </span>
                              </Link>
                            </SidebarMenuButton>
                            {item.subItems.length > 0 && (
                              <CollapsibleTrigger
                                asChild
                                className="w-auto"
                                onClick={() =>
                                  setIsSubMenuOpen((prev) => ({
                                    ...prev,
                                    [item.title]: !prev[item.title],
                                  }))
                                }
                              >
                                <SidebarMenuButton size="sm">
                                  {isSubMenuOpen[item.title] ? <ChevronDown /> : <ChevronRight />}
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                            )}
                          </div>
                          {item.subItems.length > 0 && (
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.subItems.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.title.desktop}>
                                    <SidebarMenuSubButton asChild>
                                      {typeof subItem.action === "function" ? (
                                        <button
                                          onClick={() => (subItem.action as () => void)()}
                                          className="flex w-full cursor-pointer flex-row items-center gap-2"
                                        >
                                          <span>
                                            {toUpperCaseFirstLetter(
                                              t(subItem.title.desktop, {
                                                currentMonth,
                                                currentYear,
                                                previousYear,
                                                previousMonth,
                                                yearFromPreviousMonth,
                                              })
                                            )}
                                          </span>
                                        </button>
                                      ) : (
                                        <Link
                                          to={subItem.action}
                                          className="flex w-full cursor-pointer flex-row items-center gap-2"
                                        >
                                          <span>
                                            {toUpperCaseFirstLetter(
                                              t(subItem.title.desktop, {
                                                currentMonth,
                                                currentYear,
                                                previousYear,
                                                previousMonth,
                                                yearFromPreviousMonth,
                                              })
                                            )}
                                          </span>
                                        </Link>
                                      )}
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          )}
                        </Collapsible>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
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
        <div>
          <h1></h1>
        </div>
        <div className="h-full px-2">
          <Outlet />
        </div>
        <div className="border-muted flex flex-row justify-between gap-2 border-t px-3 py-2">
          {navigationItems.map((item) => (
            <Link key={item.title} to={item.link} className="flex flex-col items-center">
              {<item.icon strokeWidth={1.5} size={26} />}
              <p className="p-0 leading-none">{t(item.navigationTitle.mobile)}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
