'use client'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowDownWideNarrow, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SheetAction } from './sheet-action'

export function GridActions() {
  const [sheetActionOpen, setSheetActionOpen] = useState<boolean>(false)
  const { actionList, fetchActionList, setCurrentTask, fetchResponsible } =
    useActionsStore()

  useEffect(() => {
    fetchActionList()
  }, [])

  async function handleOpenSheetAction(task: ActionItem) {
    setCurrentTask(task)
    fetchResponsible(task.id)
    setSheetActionOpen(true)
  }

  const columns: ColumnDef<ActionItem>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const task = row.original as ActionItem
        return (
          <Button size="icon-xs" onClick={() => handleOpenSheetAction(task)}>
            <Timer className="h-3 w-3" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'responsible.name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Responsável
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Criado em
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const createdAt = row.getValue('startDate') as string

        return createdAt
          ? dayjs(createdAt).format('DD/MM/YYYY')
          : 'Sem registro'
      },
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Prazo
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const deadline = row.getValue('endDate') as string

        return deadline ? dayjs(deadline).format('DD/MM/YYYY') : 'Sem registro'
      },
    },
    {
      accessorKey: 'equipment',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Equipamento
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'branch',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Local
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
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={actionList || []}
        isLoading={!actionList}
      />

      <SheetAction open={sheetActionOpen} onOpenChange={setSheetActionOpen} />
    </>
  )
}
