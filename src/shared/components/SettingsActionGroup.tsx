import { ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface SettingsActionGroupProps {
  title: string
  items: {
    icon: LucideIcon
    label: string
    content?: React.ReactNode
    onClick?: () => void
    isLoading?: boolean
  }[]
}

export default function SettingsActionGroup({ title, items }: SettingsActionGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-muted-foreground font-mono text-sm uppercase">{title}</h3>
      <div className="bg-sidebar flex flex-col gap-2 rounded-md p-1">
        {items.map((item, index) =>
          item.content ? (
            <div className="flex w-full items-center justify-between gap-2 rounded-md p-2 text-sm">
              <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
              {item.content}
            </div>
          ) : (
            <button
              key={index}
              className="hover:bg-muted font-base flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm"
              onClick={item.onClick}
              disabled={item.isLoading}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.isLoading && <div className="ml-auto h-4 w-4" />}
              <ChevronRight className="ml-auto h-4 w-4" />
            </button>
          )
        )}
      </div>
    </div>
  )
}
