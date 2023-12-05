'use client'

import { AttachThumbList } from '@/components/attach-thumb-list'
import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useLoading } from '@/store/loading-store'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import CryptoJS from 'crypto-js'
import dayjs from 'dayjs'
import { ArrowDownWideNarrow, FileBarChart2, Image, Timer } from 'lucide-react'
import { useState } from 'react'
import { DialogAction } from './dialog-action'

export function GridGroups() {
  const [sheetActionOpen, setSheetActionOpen] = useState<boolean>(false)
  const [attachModalOpen, setAttachModalOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const { show, hide } = useLoading()
  const {
    setCurrentTask,
    fetchResponsible,
    fetchAttach,
    clearAttach,
    attach,
    fetchDataTableGroups,
    fetchDataTableUngrouped,
    searchOption,
    setSearchOption,
  } = useActionsStore(({ attach, ...rest }) => ({
    attach: attach?.map(({ url }) => url),
    ...rest,
  }))

  const { toast } = useToast()

  async function handleOpenSheetAction({
    taskId,
    code,
  }: {
    taskId: number
    code: number
  }) {
    setCurrentTask({ taskId, code })
    fetchResponsible(taskId, searchOption)
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

  async function handleChangeGroup(value: string) {
    const option = value as 'with-action' | 'without-action'
    setSearchOption(option)
    await queryClient.invalidateQueries(['grouped-table', 'ungrouped-table'])
  }

  function handleGeneratePdf(actionId: string) {
    const hash = CryptoJS.AES.encrypt(actionId, 'action-item')
    window.open(
      `https://pdf.smartnewsistemas.com.br/generator/checklist/action?id=${hash}`,
    )
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
            <Button
              variant="outline"
              data-show={searchOption === 'with-action'}
              size="icon-xs"
              className="hidden data-[show=true]:flex"
              onClick={() => handleGeneratePdf(String(task.id))}
            >
              <FileBarChart2 className="h-3 w-3" />
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
      cell: ({ row }) => {
        const code = row.getValue('code') as number

        return code || 'Sem registro'
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
            Verificação
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
      <PageHeader className="p-4">
        <div className="flex flex-col gap-2">
          <Label>Filtrar grupos:</Label>
          <Select value={searchOption} onValueChange={handleChangeGroup}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="with-action">Com ação</SelectItem>
              <SelectItem value="without-action">Sem ação</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {searchOption === 'with-action' ? (
        <DataTableServerPagination
          id="grouped-table"
          columns={columns}
          fetchData={fetchDataTableGroups}
        />
      ) : (
        <DataTableServerPagination
          id="ungrouped-table"
          columns={columns}
          fetchData={fetchDataTableUngrouped}
        />
      )}

      <DialogAction open={sheetActionOpen} onOpenChange={setSheetActionOpen} />

      <AttachThumbList
        images={attach || []}
        open={attachModalOpen}
        onOpenChange={setAttachModalOpen}
      />
    </>
  )
}
