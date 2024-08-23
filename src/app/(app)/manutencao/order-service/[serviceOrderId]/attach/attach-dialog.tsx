'use client'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ComponentProps, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface AttachDialogProps extends ComponentProps<typeof Dialog> {}

export function AttachDialog({ children, ...props }: AttachDialogProps) {
  const [files, setFiles] = useState<string[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles)
    setFiles((oldFiles) => [
      ...oldFiles,
      ...acceptedFiles.map(URL.createObjectURL),
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-5xl">
        <div
          {...getRootProps()}
          className={cn(
            'flex h-full w-full flex-col overflow-auto rounded-md border-4 border-dashed p-4 transition-colors',
            isDragActive
              ? 'border-violet-400 bg-violet-200'
              : 'border-zinc-300',
          )}
        >
          <input {...getInputProps()} />

          {files.length ? (
            <div className="grid max-h-full w-full grid-cols-auto-md items-start gap-4 overflow-auto">
              {files.map((url) => (
                <Image
                  width={150}
                  height={150}
                  alt=""
                  src={url}
                  className="aspect-square w-full rounded border object-cover"
                  key={url}
                  draggable={false}
                />
              ))}
            </div>
          ) : (
            <span className="text-1xl font-semibold text-slate-600">
              {isDragActive
                ? 'Solte seus arquivos aqui...'
                : 'Arraste ou clique aqui para adicionar arquivos.'}
            </span>
          )}
        </div>{' '}
      </DialogContent>
    </Dialog>
  )
}
