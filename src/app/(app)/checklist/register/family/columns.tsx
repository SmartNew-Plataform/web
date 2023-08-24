'use client'

import { Button } from '@/components/ui/button'
import { FamilyData } from '@/store/core-screens-store'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowDownWideNarrow } from 'lucide-react'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Family = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const columns: ColumnDef<FamilyData>[] = [
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Familia
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'task',
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
    cell: ({ row }) => {
      const task: FamilyData['task'] = row.getValue('task')
      return <span>{task.description}</span>
    },
  },
]
