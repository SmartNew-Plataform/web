'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Save, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ComponentProps, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface AttachDialogProps extends ComponentProps<typeof Dialog> {}

export function AttachDialog({ children, ...props }: AttachDialogProps) {
  const [files, setFiles] = useState<File[]>([])
  const params = useParams()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((oldFiles) => [...oldFiles, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })

  async function handleRegisterAttach() {
    if (files.length === 0) return
    const response = await Promise.all(
      files.map((file) => {
        const data = new FormData()
        data.append('file', file)
        return api.post(
          `/maintenance/service-order/${params.serviceOrderId}/attachments`,
          data,
        )
      }),
    )

    console.log(response)
  }

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-5xl">
        <div
          {...getRootProps()}
          className={cn(
            'flex h-20 w-full items-center justify-center rounded-md border-4 border-dashed p-4 transition-colors',
            isDragActive
              ? 'border-violet-400 bg-violet-200'
              : 'border-zinc-300',
          )}
        >
          <input {...getInputProps()} />
          <p className="text-zinc-500">
            {isDragActive
              ? 'Solte seus arquivos aqui...'
              : 'Adicione arquivos arrastando ou clicando aqui.'}
          </p>
        </div>
        <div className="flex h-full w-full flex-col overflow-auto">
          {
            <div className="grid max-h-full w-full grid-cols-auto-md items-start gap-4 overflow-auto">
              {files.map((file) => {
                const url = URL.createObjectURL(file)
                return (
                  <div key={url} className="relative">
                    <Button
                      variant="destructive"
                      size="icon-xs"
                      className="absolute right-1 top-1"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Trash2 size={14} />
                    </Button>
                    <Image
                      width={150}
                      height={150}
                      alt=""
                      src={url}
                      className="aspect-square w-full rounded border object-cover"
                      draggable={false}
                    />
                  </div>
                )
              })}
            </div>
          }
        </div>
        <Button onClick={handleRegisterAttach}>
          <Save size={16} />
          Salvar
        </Button>
      </DialogContent>
    </Dialog>
  )
}
