'use client'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { useTaskControlStore } from '@/store/taskcontrol/taskcontrol-store'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowDownWideNarrow, ExternalLink } from 'lucide-react'
import { useEffect } from 'react'

interface TaskControlData {
  id: number
  client: string
  title: string
  status: string
  issuer: string
  emission: string
}

export function GridTaskControl() {
  const { loadTasks } = useTaskControlStore()
  const columns: ColumnDef<TaskControlData>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        const id = row.getValue('id') as number

        return (
          <div className="flex gap-2">
            <Button size="icon-xs">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'client',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cliente
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Titulo
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'issuer',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Emissor
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'emission',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Emissão
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  useEffect(() => {
    loadTasks()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={columns} data={[]} />
    </div>
  )
}
