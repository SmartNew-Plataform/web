'use client'
import { AttachPreview } from '@/components/attach-preview'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useLoading } from '@/store/loading-store'
import { useServiceOrderAttach } from '@/store/maintenance/service-order-attach'
import { useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ComponentProps, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface AttachDialogProps extends ComponentProps<typeof Dialog> {}

export function AttachDialog({ children, ...props }: AttachDialogProps) {
  const { defaultData } = useServiceOrderAttach()
  const [files, setFiles] = useState<File[]>(defaultData || [])
  const params = useParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const loading = useLoading()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles)

    setFiles((oldFiles) => [...oldFiles, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })

  async function handleRegisterAttach() {
    if (files.length === 0) return
    loading.show()
    await Promise.all(
      files.map((file) => {
        const data = new FormData()
        data.append('file', file)
        return api
          .post(
            `/maintenance/service-order/${params.serviceOrderId}/attachments`,
            data,
          )
          .finally(() => {
            toast({
              title: 'Anexo enviado com sucesso!',
              variant: 'success',
            })
          })
          .catch(() =>
            toast({
              title: `Erro ao mandar anexo ${file.name}`,
              variant: 'destructive',
            }),
          )
      }),
    ).finally(loading.hide)

    queryClient.refetchQueries(['maintenance/service-order/attach'])
    setFiles([])
  }

  function handleDeleteAttach(filename: string) {
    setFiles((oldFiles) => {
      return oldFiles.filter((file) => file.name !== filename)
    })
  }

  useEffect(() => {
    if (defaultData) setFiles(defaultData)
  }, [defaultData])

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
                const typeSpliced = file.name.split('.')
                const type = typeSpliced[typeSpliced.length - 1]

                return (
                  <AttachPreview
                    key={file.name}
                    file={type === 'pdf' ? file : url}
                    onDelete={() => handleDeleteAttach(file.name)}
                    type={type}
                    name={file.name}
                  />
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
