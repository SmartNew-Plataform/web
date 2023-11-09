'use client'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowDownWideNarrow, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SheetAction } from './sheet-action'

export function GridActions() {
  const [sheetActionOpen, setSheetActionOpen] = useState<boolean>(false)
  const { actionList, fetchActionList, setCurrentTaskId, fetchResponsible } =
    useActionsStore()

  useEffect(() => {
    fetchActionList()
  }, [])

  async function handleOpenSheetAction(id: number) {
    setCurrentTaskId(id)
    fetchResponsible(id)
    setSheetActionOpen(true)
  }

  const columns: ColumnDef<ActionItem>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const id = row.getValue('id') as ActionItem['id']

        return (
          <Button size="icon-xs" onClick={() => handleOpenSheetAction(id)}>
            <Zap className="h-3 w-3" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'responsible',
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
      accessorKey: 'createdAt',
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
        const createdAt = row.getValue('createdAt') as string

        return dayjs(createdAt).format('DD/MM/YYYY')
      },
    },
    {
      accessorKey: 'deadline',
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
        const deadline = row.getValue('deadline') as string

        return dayjs(deadline).format('DD/MM/YYYY')
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
