import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TableExcel } from './table'
import { ComponentProps } from 'react'

interface IChildrenModal extends ComponentProps<typeof Dialog> {
  data: { [key: string]: string }[]
}

export function ChildrenModal({ data, ...rest }: IChildrenModal) {
  return (
    <Dialog {...rest}>
      <DialogContent className="max-w-5xl">
        <TableExcel model="children" item={data} />
      </DialogContent>
    </Dialog>
  )
}
