'use client'

import { cn } from '@/lib/utils'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useController, useFormContext } from 'react-hook-form'
import { AttachPreview } from '../attach-preview'

interface AttachDragDropProps {
  name: string
}

export function AttachDragDrop({ name }: AttachDragDropProps) {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
    defaultValue: [],
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      field.onChange([...field.value, ...acceptedFiles])
    },
    [field.value],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      'application/pdf': [],
    },
  })

  function handleDeleteAttach(filename: string) {
    const files = field.value.filter((file: File) => file.name !== filename)
    field.onChange(files)
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={cn(
          'flex h-20 w-full items-center justify-center rounded-md border-4 border-dashed p-4 transition-colors',
          isDragActive ? 'border-violet-400 bg-violet-200' : 'border-zinc-300',
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
          <div className="grid max-h-full w-full grid-cols-auto-sm items-start gap-4 overflow-auto">
            {field.value?.map((file: File) => {
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
    </div>
  )
}
