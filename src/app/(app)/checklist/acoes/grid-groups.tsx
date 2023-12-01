'use client'

import { AttachThumbList } from '@/components/attach-thumb-list'
import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useLoading } from '@/store/loading-store'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowDownWideNarrow, Image, Timer } from 'lucide-react'
import { useState } from 'react'
import { SheetAction } from './sheet-action'

export function GridGroups() {
  const [sheetActionOpen, setSheetActionOpen] = useState<boolean>(false)
  const [attachModalOpen, setAttachModalOpen] = useState<boolean>(false)
  const { show, hide } = useLoading()
  const {
    setCurrentTask,
    fetchResponsible,
    fetchAttach,
    clearAttach,
    attach,
    fetchDataTableGroups,
  } = useActionsStore(({ attach, ...rest }) => ({
    attach: attach?.map(({ url }) => url),
    ...rest,
  }))
  const { toast } = useToast()

  async function handleOpenSheetAction({
    taskId,
    code,
    branchId,
  }: {
    taskId: number
    code: number
    branchId: number
  }) {
    setCurrentTask({ taskId, code })
    fetchResponsible(branchId)
    setSheetActionOpen(true)
  }

  async function loadAttach(actionId: number | null) {
    if (!actionId) return
    clearAttach()
    show()
    const responseAttach = await fetchAttach(actionId)
    hide()
    if (responseAttach.length > 0) {
      setAttachModalOpen(true)
      return
    }

    toast({
      title: 'Nenhum anexo encontrado nessa ação!',
    })
  }

  const columns: ColumnDef<ActionItem>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const task = row.original as ActionItem
        return (
          <div className="flex gap-2">
            <Button
              size="icon-xs"
              onClick={() =>
                handleOpenSheetAction({
                  taskId: task.id,
                  code: task.code,
                  branchId: task.branchId,
                })
              }
            >
              <Timer className="h-3 w-3" />
            </Button>
            <Button
              variant="secondary"
              disabled={!task.actionId}
              size="icon-xs"
              onClick={() => loadAttach(task.actionId)}
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'code',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Código
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
      <DataTableServerPagination
        id="group-table"
        columns={columns}
        fetchData={fetchDataTableGroups}
      />

      <SheetAction open={sheetActionOpen} onOpenChange={setSheetActionOpen} />

      <AttachThumbList
        images={attach || []}
        open={attachModalOpen}
        onOpenChange={setAttachModalOpen}
      />
    </>
  )
}
