'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from './ui/button'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface PdfFilePReviewProps {
  file: File | string | { url: string }
  pageWidth?: number
}

function Preview({ file, pageWidth = 150 }: PdfFilePReviewProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages)
    },
    [],
  )

  function handleChangePage(direction: number) {
    const newPage = direction + pageNumber

    if (newPage > numPages || newPage < 1) return

    setPageNumber(newPage)
  }

  return (
    <div className="relative h-full w-full">
      <Document
        file={file}
        className="h-full w-full "
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page
          className="flex items-center justify-center"
          pageNumber={pageNumber}
          loading={<p>Carregando pdf...</p>}
          noData={<p>Nenhuma pagina encontrada.</p>}
          error={<p>Erro ao carregar PDF.</p>}
          width={pageWidth}
        />
      </Document>
      <span className="absolute bottom-2 left-1/2 z-50 flex -translate-x-1/2 items-center rounded-md bg-white shadow">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => handleChangePage(-1)}
        >
          <ChevronLeft size={14} />
        </Button>
        {pageNumber}/{numPages}
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => handleChangePage(1)}
        >
          <ChevronRight size={14} />
        </Button>
      </span>
    </div>
  )
}

export const PdfFilePreview = memo(Preview)
