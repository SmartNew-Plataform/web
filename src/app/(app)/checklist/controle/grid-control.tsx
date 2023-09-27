'use client'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowDownWideNarrow } from 'lucide-react'

interface GridControlData {
  id: number
  description: string
  color: string
  icon: string
  type: {
    id: string
    description: string
  }
}

export function GridControl() {
  const columns: ColumnDef<GridControlData>[] = [
    {
      accessorKey: 'id',
      header: '',
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Descrição
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'color',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cor
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const color = row.getValue('color') as string

        return (
          <div className="flex items-center gap-4">
            <span className={`bg-[${color}] h-8 w-8 rounded-full`} />
            {color}
          </div>
        )
      },
    },
    {
      accessorKey: 'icon',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Icone
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const icon = row.getValue('icon') as string

        return <div className="flex items-center gap-4">{icon}</div>
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tipo
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const type = row.getValue('type') as GridControlData['type']

        return <div className="flex items-center gap-4">{type.description}</div>
      },
    },
  ]

  return <DataTable columns={columns} data={[]} />
}
