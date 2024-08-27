'use client'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export function AttachList() {
  const [files, setFiles] = useState<string[]>([])
  const params = useParams()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles)
    setFiles((oldFiles) => [
      ...oldFiles,
      ...acceptedFiles.map(URL.createObjectURL),
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  })

  const { data } = useQuery({
    queryKey: ['maintenance/service-order/attach'],
    queryFn: async () => {
      const response = await api.get<{ data: { url: string }[] }>(
        `/maintenance/service-order/${params.serviceOrderId}/attachments`,
      )

      if (response.status !== 200) return

      return response.data.data
    },
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex h-full w-full flex-col overflow-auto rounded-md border-4 border-dashed p-4 transition-colors',
        isDragActive ? 'border-violet-400 bg-violet-200' : 'border-zinc-300',
      )}
    >
      <input {...getInputProps()} />

      {files.length ? (
        <div className="grid max-h-full w-full grid-cols-auto-md items-start gap-4 overflow-auto">
          {data?.map(({ url }) => (
            <Image
              width={500}
              height={500}
              alt=""
              src={url}
              className="aspect-square w-full rounded border object-cover"
              key={url}
              draggable={false}
            />
          ))}
          {files?.map((url) => (
            <Image
              width={500}
              height={500}
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
            : 'Arraste e solte somente arquivos aqui.'}
        </span>
      )}
    </div>
  )
}
