'use client'
import { useImportation } from '@/store/manager/importation'
import { ChildrenModal } from './children-modal'
import { TableExcel } from './table-excel'

export function Main() {
  const { children, setChildren } = useImportation()

  return (
    <>
      <ChildrenModal
        data={children || []}
        onOpenChange={(e) => setChildren(e ? children : undefined)}
        open={!!children?.length}
      />

      <TableExcel model="data" />
    </>
  )
}
