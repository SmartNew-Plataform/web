import { Paperclip } from 'lucide-react'
import { Button } from '../ui/button'

interface AttachProps {
  createFn: () => Promise<void>
  deleteFn: (params: { id }) => Promise<void>
  data: Array<{
    name: string
    url: string
  }>
  placeholder?: string
}

export function Attach({
  createFn,
  deleteFn,
  data,
  placeholder = 'Clique para inserir um anexo',
}: AttachProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <label className="w-full">
        <Button
          variant="outline"
          type="button"
          className="justify-between normal-case text-slate-700"
        >
          {placeholder}
          <Paperclip size={12} />
        </Button>
        <input type="file" className="" />
      </label>
    </div>
  )
}
