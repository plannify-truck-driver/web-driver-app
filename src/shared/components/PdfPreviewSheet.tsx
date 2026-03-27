import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { DownloadIcon, XIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfPreviewSheetProps {
  blob: Blob | null
  filename: string
  open: boolean
  onClose: () => void
}

export function PdfPreviewSheet({ blob, filename, open, onClose }: PdfPreviewSheetProps) {
  const { t } = useTranslation()
  const [numPages, setNumPages] = useState<number>(0)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const fileUrl = useMemo(() => {
    if (!blob) return null
    const pdfBlob =
      blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" })
    return URL.createObjectURL(pdfBlob)
  }, [blob])

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl)
    }
  }, [fileUrl])

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const observer = new ResizeObserver(updateWidth)
    if (containerRef.current) {
      observer.observe(containerRef.current)
      updateWidth()
    }
    return () => observer.disconnect()
  }, [open, updateWidth])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open || !fileUrl) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <p className="text-sm font-medium text-white">{t("components.pdf-preview.title")}</p>
        <div className="flex items-center gap-1">
          <a
            href={fileUrl}
            download={filename}
            className="rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <DownloadIcon className="size-5" />
            <span className="sr-only">{t("components.pdf-preview.download")}</span>
          </a>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <XIcon className="size-5" />
            <span className="sr-only">{t("components.pdf-preview.close")}</span>
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 pb-4">
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(error) => console.error("PDF load error:", error)}
          loading={
            <div className="flex h-full items-center justify-center">
              <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          }
          error={
            <p className="text-center text-sm text-white/60">{t("components.pdf-preview.error")}</p>
          }
          className="flex flex-col items-center gap-3"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={containerWidth || undefined}
              className="shadow-lg"
            />
          ))}
        </Document>
      </div>
    </div>
  )
}
