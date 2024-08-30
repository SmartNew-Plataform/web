import {
  Download,
  FilePieChart,
  FileQuestion,
  FileSpreadsheet,
  FileText,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
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

  const isImage = type === 'png' || type === 'jpg' || type === 'jpeg'
  const isVideo =
    type === 'mp4' ||
    type === 'avi' ||
    type === 'wmv' ||
    type === 'mkv' ||
    type === 'mov'
  const isModalPreview = isImage || isVideo
  console.log(`IMAGE ${isImage} | VIDEO ${isVideo}`)

  return (
    <Dialog>
      <DialogTrigger disabled={!isModalPreview} type="button">
        <Tooltip>
          <TooltipTrigger type="button" asChild>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded border">
              <div className="absolute right-1 top-1 z-[999999] flex gap-1">
                <a href={url} download target="_blank">
                  <Button size="icon-xs" type="button">
                    <Download size={14} />
                  </Button>
                </a>
                <Button
                  variant="destructive"
                  size="icon-xs"
                  onClick={onDelete}
                  type="button"
                >
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
              ) : type === 'png' || type === 'jpg' || type === 'jpeg' ? (
                <Image
                  width={500}
                  height={500}
                  alt=""
                  src={file as string}
                  className="aspect-square w-full object-cover"
                  draggable={false}
                />
              ) : type === 'mp4' ||
                type === 'avi' ||
                type === 'wmv' ||
                type === 'mkv' ||
                type === 'mov' ? (
                <video
                  src={url}
                  className="h-full w-full object-cover"
                  controls
                ></video>
              ) : (
                <div className="aspect-square rounded-full bg-slate-200 p-4 text-slate-600">
                  <FileQuestion size={32} />
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="p-0">
        {isImage ? (
          <Image
            width={500}
            height={500}
            alt=""
            src={url as string}
            className="rounded"
            draggable={false}
          />
        ) : isVideo ? (
          <video src={url} controls className="rounded"></video>
        ) : (
          'Sem previa disponível!'
        )}
      </DialogContent>
    </Dialog>
  )
}
