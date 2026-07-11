import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "./ui/Drawer"
import {
  ArrowLeftIcon,
  FileChartColumnIncreasingIcon,
  FileCodeIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "./ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select"

export interface ImportWorkdaysFromFileDialogProps {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  initialFileType?: FileType
}

const FILE_TYPES = ["csv", "xlsx"] as const
type FileType = (typeof FILE_TYPES)[number]

const REQUIRED_HEADERS = ["date", "start_time", "end_time", "rest_time", "overnight_rest"] as const
type RequiredHeader = (typeof REQUIRED_HEADERS)[number]
type AttributeMapping = Partial<Record<RequiredHeader, string>>

type View = "upload" | "file-info" | "mapping"

export function ImportWorkdaysFromFileDialog({
  isOpen,
  setIsOpen,
  initialFileType = "xlsx",
}: ImportWorkdaysFromFileDialogProps) {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState<FileType>(initialFileType)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isFileFromPlannify, setIsFileFromPlannify] = useState(false)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [attributeMapping, setAttributeMapping] = useState<AttributeMapping>({})
  const [view, setView] = useState<View>("upload")

  const handleFile = (file: File | undefined) => {
    if (!file) return
    setSelectedFile(file)
    setView("file-info")

    const reader = new FileReader()
    reader.onload = (e) => {
      const firstLine = (e.target?.result as string).split("\n")[0]
      const headers = firstLine.split(";").map((h) => h.trim().replace(/^["']|["']$/g, ""))
      setCsvHeaders(headers)
      const isValid = REQUIRED_HEADERS.every((attr) => headers.includes(attr))
      setIsFileFromPlannify(isValid)
    }
    reader.readAsText(file)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedFile(null)
      setIsFileFromPlannify(false)
      setCsvHeaders([])
      setAttributeMapping({})
      setView("upload")
      setFileType(initialFileType)
    }
    setIsOpen(open)
  }

  const selectedIndex = FILE_TYPES.indexOf(fileType)
  const labels: Record<FileType, string> = {
    csv: t("components.import-workdays-from-file-dialog.csv-label"),
    xlsx: t("components.import-workdays-from-file-dialog.excel-label"),
  }
  const attributeLabels: Record<RequiredHeader, string> = {
    date: t("components.import-workdays-from-file-dialog.mapping-attr-date"),
    start_time: t("components.import-workdays-from-file-dialog.mapping-attr-start_time"),
    end_time: t("components.import-workdays-from-file-dialog.mapping-attr-end_time"),
    rest_time: t("components.import-workdays-from-file-dialog.mapping-attr-rest_time"),
    overnight_rest: t("components.import-workdays-from-file-dialog.mapping-attr-overnight_rest"),
  }

  const isMappingComplete = REQUIRED_HEADERS.every((attr) => attributeMapping[attr])

  const title =
    view === "mapping"
      ? t(`components.import-workdays-from-file-dialog.title-${fileType}`)
      : t(`components.import-workdays-from-file-dialog.title-${fileType}`)
  const description =
    view === "mapping"
      ? t("components.import-workdays-from-file-dialog.mapping-description")
      : t("components.import-workdays-from-file-dialog.description")

  const body = (
    <div className="flex flex-col gap-4 p-4">
      {view === "mapping" ? (
        <>
          <div className="flex flex-col gap-3">
            {REQUIRED_HEADERS.map((attr) => (
              <div key={attr} className="flex items-center justify-between gap-4">
                <span className="shrink-0 text-sm font-medium">{attributeLabels[attr]}</span>
                <Select
                  value={attributeMapping[attr] ?? ""}
                  onValueChange={(value) =>
                    setAttributeMapping((prev) => ({ ...prev, [attr]: value }))
                  }
                >
                  <SelectTrigger className="w-44">
                    <SelectValue
                      placeholder={t(
                        "components.import-workdays-from-file-dialog.mapping-select-placeholder"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {csvHeaders
                      .filter(
                        (header) =>
                          !Object.entries(attributeMapping).some(
                            ([key, value]) => value === header && key !== attr
                          )
                      )
                      .map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" className="flex-1 py-5" onClick={() => setView("file-info")}>
              <ArrowLeftIcon />
              {t("components.import-workdays-from-file-dialog.mapping-back")}
            </Button>
            <Button className="flex-1 py-5" disabled={!isMappingComplete} onClick={() => {}}>
              {t("components.import-workdays-from-file-dialog.mapping-confirm")}
            </Button>
          </div>
        </>
      ) : view === "file-info" && selectedFile ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4">
            {fileType === "csv" ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#F59E0B]/10">
                <FileCodeIcon className="text-[#F59E0B]" />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#217346]/10">
                <FileChartColumnIncreasingIcon className="text-[#217346]" />
              </div>
            )}
            <p className="truncate text-sm">{selectedFile.name}</p>
          </div>
          {isFileFromPlannify ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800">
                  {t("components.import-workdays-from-file-dialog.recognized-file")}
                </p>
              </div>
              <Button className="w-full rounded-xl py-6 text-base font-semibold" onClick={() => {}}>
                {t("components.import-workdays-from-file-dialog.import-button")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="rounded-md bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  {t("components.import-workdays-from-file-dialog.unrecognized-file")}
                </p>
              </div>
              <Button
                className="w-full rounded-xl py-6 text-base font-semibold"
                onClick={() => setView("mapping")}
              >
                {t("components.import-workdays-from-file-dialog.specify-attributes-button")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="bg-muted relative flex w-full rounded-lg p-1">
            <div
              className="bg-background absolute top-1 bottom-1 rounded-md shadow-sm transition-transform duration-200 ease-in-out"
              style={{
                width: `calc(${100 / FILE_TYPES.length}% - 4px)`,
                transform: `translateX(calc(${selectedIndex * 100}% + ${selectedIndex * 4}px))`,
              }}
            />
            {FILE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setFileType(type)}
                className={cn(
                  "relative z-10 flex-1 cursor-pointer rounded-md py-2 text-sm font-medium transition-colors duration-200",
                  fileType === type
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {labels[type]}
              </button>
            ))}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={`.${fileType}`}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleFile(e.dataTransfer.files[0])
            }}
            className={cn(
              "border-border flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors",
              isDragging ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            )}
          >
            <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-xl">
              <UploadIcon size={24} className="text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-foreground font-semibold">
                {t(`components.import-workdays-from-file-dialog.drop-zone-label-${fileType}`)}
              </p>
              <p className="text-muted-foreground text-sm">
                {t("components.import-workdays-from-file-dialog.drop-zone-sublabel")}
              </p>
            </div>
          </div>
          <Button
            className="w-full rounded-xl py-6 text-base font-semibold"
            onClick={() => inputRef.current?.click()}
          >
            {t("components.import-workdays-from-file-dialog.browse-files")}
          </Button>
        </>
      )}
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between gap-4">
            <DrawerTitle>{title}</DrawerTitle>
            <button
              onClick={() => handleOpenChange(false)}
              className="text-muted-foreground hover:bg-muted bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-1"
            >
              <XIcon size={16} />
            </button>
          </div>
          <DrawerDescription className="text-left">{description}</DrawerDescription>
        </DrawerHeader>
        {body}
      </DrawerContent>
    </Drawer>
  )
}
