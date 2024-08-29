import { FileSpreadsheet, FileText, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { PdfFilePreview } from './pdf-file-preview'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface AttachPreviewProps {
  onDelete: () => void
  file: File | string
  type: string
  name?: string
}

export function AttachPreview({
  onDelete,
  file,
  type,
  name,
}: AttachPreviewProps) {
  const url = typeof file === 'string' ? file : URL.createObjectURL(file)
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="relative aspect-square overflow-hidden rounded border text-zinc-600">
          <Button
            variant="destructive"
            size="icon-xs"
            className="absolute right-1 top-1 z-[999999]"
            onClick={onDelete}
          >
            <Trash2 size={14} />
          </Button>
          {type === 'pdf' ? (
            <a
              href={url}
              target="_blank"
              className="flex h-full w-full items-center justify-center"
            >
              <PdfFilePreview file={file} pageWidth={500} />
            </a>
          ) : type === 'xls' || type === 'xlsx' ? (
            <a
              href={url}
              download
              className="flex h-full w-full items-center justify-center"
            >
              <FileSpreadsheet size={32} />
            </a>
          ) : type === 'doc' || type === 'docx' ? (
            <a
              href={url}
              download
              className="flex h-full w-full items-center justify-center"
            >
              <FileText size={32} />
            </a>
          ) : (
            <Image
              width={500}
              height={500}
              alt=""
              src={file as string}
              className="aspect-square w-full object-cover"
              draggable={false}
            />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  )
}
