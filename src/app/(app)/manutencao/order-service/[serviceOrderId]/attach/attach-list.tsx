'use client'
import { AttachPreview } from '@/components/attach-preview'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useLoading } from '@/store/loading-store'
import { useServiceOrderAttach } from '@/store/maintenance/service-order-attach'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { AttachDialog } from './attach-dialog'

export function AttachList() {
  const params = useParams()
  const [attachDialogOpen, setAttachDialogOpen] = useState(false)
  const { setDefaultData } = useServiceOrderAttach()
  const { toast } = useToast()
  const loading = useLoading()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles) {
      console.log(acceptedFiles)

      setAttachDialogOpen(true)
      setDefaultData(acceptedFiles)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  })

  const { data, refetch } = useQuery({
    queryKey: ['maintenance/service-order/attach'],
    queryFn: async () => {
      const response = await api.get<{
        data: { url: string; id: number; nameAttachment: string }[]
      }>(`/maintenance/service-order/${params.serviceOrderId}/attachments`)

      if (response.status !== 200) return

      return response.data.data
    },
  })

  async function handleDeleteAttach(id: number) {
    loading.show()
    const response = await api
      .delete(
        `/maintenance/service-order/${params.serviceOrderId}/attachments/${id}`,
      )
      .finally(loading.hide)

    if (response.status !== 200) return

    toast({
      title: 'Anexo deletado com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          'flex h-full w-full flex-col overflow-auto rounded-md border-4 border-dashed p-4 transition-colors',
          isDragActive ? 'border-violet-400 bg-violet-200' : 'border-zinc-300',
        )}
      >
        <input {...getInputProps()} />

        {data?.length ? (
          <div className="grid max-h-full w-full grid-cols-auto-md items-start gap-4 overflow-auto">
            {data?.map(({ url, id, nameAttachment }) => {
              const nameSpliced = nameAttachment.split('.')
              const type = nameSpliced[nameSpliced.length - 1]
              return (
                <AttachPreview
                  key={url}
                  file={url}
                  type={type}
                  name={nameAttachment}
                  onDelete={() => handleDeleteAttach(id)}
                />
              )
            })}
          </div>
        ) : (
          <span className="text-1xl font-semibold text-slate-600">
            {isDragActive
              ? 'Solte seus arquivos aqui...'
              : 'Arraste e solte somente arquivos aqui.'}
          </span>
        )}
      </div>

      <AttachDialog
        open={attachDialogOpen}
        onOpenChange={(e) => {
          setAttachDialogOpen(e)
          setDefaultData(undefined)
        }}
      />
    </>
  )
}
