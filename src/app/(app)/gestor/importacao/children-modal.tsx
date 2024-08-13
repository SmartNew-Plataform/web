'use client'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useImportation } from '@/store/manager/importation'
import { ComponentProps } from 'react'
import { Table } from './table'

interface IChildrenModal extends ComponentProps<typeof Dialog> {
  data: { [key: string]: string }[]
}

export function ChildrenModal({ data, ...rest }: IChildrenModal) {
  const { columnItem } = useImportation()
  return (
    <Dialog {...rest}>
      <DialogContent className="max-w-5xl">
        <Table model="children" columns={columnItem || []} data={data} />
      </DialogContent>
    </Dialog>
  )
}
