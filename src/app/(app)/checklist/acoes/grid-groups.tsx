'use client'

import { AttachThumbList } from '@/components/attach-thumb-list'
import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
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
  const [selectedRows, setSelectedRows] = useState<ActionItem[] | undefined>()
  const queryClient = useQueryClient()

  const { show, hide } = useLoading()
  const {
    setCurrentTask,
    fetchResponsible,
    groupAttach,
    fetchDataTableGroups,
    fetchDataTableUngrouped,
    searchOption,
    setSearchOption,
    fetchGroupAttach,
    clearGroupAttach,
  } = useActionsStore(({ groupAttach, ...rest }) => ({
    groupAttach: groupAttach?.map(({ url }) => url),
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

  async function loadAttach(groupId: number | null) {
    if (!groupId) return
    clearGroupAttach()
    show()
    const responseAttach = await fetchGroupAttach(groupId)
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

  async function handleExportExcel() {
    const currentQuery =
      searchOption === 'with-action' ? 'action/group' : 'action'

    const data = await api
      .get(`/smart-list/${currentQuery}`, {
        params: { index: null, perPage: null },
      })
      .then((res) => res.data)
    console.log(data)

    if (!data?.rows) return
    show()
    await fetch('https://excel-api.smartnewsistemas.com.br/exportDefault', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        currencyFormat: [],
        title: 'Ações',
        data: data.rows.map((item: ActionItem) => ({
          código: item.code,
          verificação: item.task,
          'criado em': item.startDate,
          prazo: item.endDate,
          equipamento: item.equipment,
          local: item.branch,
          repensável: item.responsible?.name,
          status: item.status,
        })),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const a = document.createElement('a')
        a.href = url
        a.download = `acoes_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch((error) => console.error(error))
    hide()
  }

  const handleSelectionChange = (selectedRows: ActionItem[]) => {
    setSelectedRows(selectedRows)
  }

  function handleOpenAllPdf() {
    selectedRows?.forEach(({ id }) => handleGeneratePdf(String(id)))
  }

  const columns: ColumnDef<ActionItem>[] = [
    {
      accessorKey: 'id',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleciona todas"
          data-show={searchOption === 'with-action'}
          className="hidden data-[show=true]:flex"
        />
      ),
      cell: ({ row }) => {
        const task = row.original as ActionItem
        return (
          <div className="flex items-center gap-2">
            <div
              data-show={searchOption === 'with-action'}
              className="hidden items-center gap-2 data-[show=true]:flex"
            >
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Selecionar linha"
              />
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => handleGeneratePdf(String(task.id))}
              >
                <FileBarChart2 className="h-3 w-3" />
              </Button>
            </div>
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
              disabled={!task.id}
              size="icon-xs"
              onClick={() => loadAttach(task.id)}
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
      sortingFn: 'datetime',
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
      accessorKey: 'equipment',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Ativo/Diverso
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
      accessorKey: 'endDate',
      sortingFn: 'datetime',
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

        <div className="flex items-center gap-2">
          <Button onClick={handleExportExcel} variant="outline">
            <FileBarChart2 className="h-4 w-4" />
            Excel
          </Button>
          <Button onClick={handleOpenAllPdf}>
            <FileBarChart2 className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </PageHeader>

      {searchOption === 'with-action' ? (
        <DataTableServerPagination
          id="grouped-table"
          columns={columns}
          fetchData={fetchDataTableGroups}
          onRowSelection={handleSelectionChange}
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
        images={groupAttach || []}
        open={attachModalOpen}
        onOpenChange={setAttachModalOpen}
      />
    </>
  )
}
