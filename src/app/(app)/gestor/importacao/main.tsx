'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  IImportationForData,
  useImportation,
} from '@/store/manager/importation'
import { ColumnDef } from '@tanstack/react-table'
import { CircleAlert, CircleCheck, CircleX, Expand } from 'lucide-react'
import { ChildrenModal } from './children-modal'
import { Table } from './table'

export function Main() {
  const {
    children,
    setChildren,
    columns,
    data,
    setChildrenIndex,
    childrenIndex,
  } = useImportation()

  const columnsTable: ColumnDef<object>[] = [
    {
      accessorKey: 'children',
      header: '',
      cell: (row) => {
        const value = row.getValue() as IImportationForData[]
        const hasChildren = value.length > 0
        const id = row.row.getValue('id') as number
        return (
          <Button
            variant="secondary"
            size="icon-xs"
            disabled={!hasChildren}
            onClick={() =>
              handleOpenChildrenModal({ index: id - 1, data: value })
            }
          >
            <Expand size={12} />
          </Button>
        )
      },
    },
    {
      accessorKey: 'sync',
      header: 'sinc.',
      cell: (row) => {
        const colors = {
          red: {
            bg: 'bg-red-200',
            color: 'text-red-500',
            icon: CircleX,
          },
          green: {
            bg: 'bg-green-200',
            color: 'text-green-500',
            icon: CircleCheck,
          },
          yellow: {
            bg: 'bg-yellow-200',
            color: 'text-yellow-500',
            icon: CircleAlert,
          },
        }
        const currentColor =
          row.getValue() === null ? 'yellow' : row.getValue() ? 'green' : 'red'
        const Icon = colors[currentColor].icon

        return (
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full',
              colors[currentColor].bg,
              colors[currentColor].color,
            )}
          >
            <Icon size={14} />
          </div>
        )
      },
    },
    ...columns!,
  ]

  function handleOpenChildrenModal({
    index,
    data,
  }: {
    index: number
    data: IImportationForData[]
  }) {
    setChildren(data)
    setChildrenIndex(index)
  }

  return (
    <>
      <ChildrenModal
        data={children || []}
        onOpenChange={(e) => setChildrenIndex(e ? childrenIndex : undefined)}
        open={childrenIndex !== undefined}
      />

      {/* <TableExcel model="data" /> */}
      <Table model="data" columns={columnsTable} data={data} />
    </>
  )
}
