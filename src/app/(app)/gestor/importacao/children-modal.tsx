import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ComponentProps } from 'react'
import { TableExcel } from './table-excel'

interface IChildrenModal extends ComponentProps<typeof Dialog> {
  data: { [key: string]: string }[]
}

export function ChildrenModal({ data, ...rest }: IChildrenModal) {
  return (
    <Dialog {...rest}>
      <DialogContent className="max-w-5xl">
        <TableExcel model="children" />
      </DialogContent>
    </Dialog>
  )
}
