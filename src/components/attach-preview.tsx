import {
  Download,
  FilePieChart,
  FileSpreadsheet,
  FileText,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
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
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded border">
          <div className="absolute right-1 top-1 z-[999999] flex gap-1">
            <a href={url} download target="_blank">
              <Button size="icon-xs">
                <Download size={14} />
              </Button>
            </a>
            <Button variant="destructive" size="icon-xs" onClick={onDelete}>
              <Trash2 size={14} />
            </Button>
          </div>
          {type === 'pdf' ? (
            <div className="aspect-square rounded-full bg-orange-200 p-4 text-orange-600">
              <FilePieChart size={32} />
            </div>
          ) : // <PdfFilePreview file={file} pageWidth={500} />
          type === 'xls' || type === 'xlsx' ? (
            <div className="aspect-square rounded-full bg-emerald-200 p-4 text-emerald-600">
              <FileSpreadsheet size={32} />
            </div>
          ) : type === 'doc' || type === 'docx' ? (
            <div className="aspect-square rounded-full bg-blue-200 p-4 text-blue-600">
              <FileText size={32} />
            </div>
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
