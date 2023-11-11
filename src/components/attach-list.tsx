import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

interface AttachListProps {
  data: Array<string>
  onDelete?: (url: string) => unknown
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function AttachList({ data, onDelete = () => {} }: AttachListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {data.map((url) => (
        <Dialog key={url}>
          <div className="relative border">
            <Button
              size="icon-xs"
              variant="destructive"
              className="absolute right-1 top-1"
              type="button"
              onClick={() => onDelete(url)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <DialogTrigger asChild>
              <Image
                className="h-[80px] rounded object-cover"
                objectFit="cover"
                height={80}
                width={80}
                src={url}
                alt={url}
              />
            </DialogTrigger>
          </div>
          <DialogContent className="p-0">
            <Image
              className="rounded"
              objectFit="cover"
              width={510}
              height={680}
              src={url}
              alt={url}
            />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
