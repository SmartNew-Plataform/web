'use client'

import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLoading } from '@/store/loading-store'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { ColumnDef, Row } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowDownWideNarrow, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MoveToGroupModal } from './move-to-group-modal'
import { SheetAction } from './sheet-action'

type ToggleSelectedProps = {
  task: ActionItem
  row: Row<ActionItem>
}

export function GridActions() {
  const [sheetActionOpen, setSheetActionOpen] = useState<boolean>(false)
  const [moveGroupModalOpen, setMoveGroupModalOpen] = useState<boolean>(false)
  const [currentBranch, setCurrentBranch] = useState<number>()
  const { show, hide } = useLoading()
  const {
    fetchResponsible,
    clearAttach,
    selectedTasks,
    updateSelectedTasks,
    fetchDataTable,
    fetchListGroup,
  } = useActionsStore(({ attach, ...rest }) => ({
    attach: attach?.map(({ url }) => url),
    ...rest,
  }))

  function handleToggleSelected({
    taskId,
    branchId,
  }: {
    taskId: string
    branchId: number
  }) {
    const currentTasks = selectedTasks || []

    if (!currentBranch) {
      setCurrentBranch(branchId)
    }

    if (currentTasks.includes(taskId)) {
      const tasks = currentTasks.filter((id) => id !== taskId)
      updateSelectedTasks(tasks)
      if (tasks.length === 0) setCurrentBranch(undefined)
    } else updateSelectedTasks([...currentTasks, taskId])
  }

  async function handleOpenSheetAction() {
    fetchResponsible(Number(currentBranch))
    clearAttach()
    // if (task.actionId) {
    //   fetchAttach(task.actionId)
    // }
    setSheetActionOpen(true)
  }

  async function handleOpenMoveGroupModal() {
    fetchResponsible(Number(currentBranch))
    fetchListGroup(String(currentBranch))
    setMoveGroupModalOpen(true)
  }

  const columns: ColumnDef<ActionItem>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const task = row.original as ActionItem

        return (
          <div className="flex gap-2">
            <Checkbox
              name="task"
              disabled={
                currentBranch
                  ? currentBranch !== task.branchId
                  : !!currentBranch
              }
              checked={row.getIsSelected()}
              onClick={() =>
                handleToggleSelected({
                  taskId: String(task.id),
                  branchId: task.branchId,
                })
              }
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
            {/* <Button size="icon-xs" onClick={() => handleOpenSheetAction(task)}>
              <Timer className="h-3 w-3" />
            </Button>
            <Button
              variant="secondary"
              disabled={!task.actionId}
              size="icon-xs"
              onClick={() => loadAttach(task.actionId)}
            >
              <Image className="h-3 w-3" />
            </Button> */}
          </div>
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

  useEffect(() => {
    updateSelectedTasks([])
  }, [])

  return (
    <div className="flex h-full flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="mb-2 self-end"
            disabled={selectedTasks.length === 0}
          >
            <Timer />
            Atribuir ação
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleOpenMoveGroupModal}>
            Adicionar a um grupo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenSheetAction}>
            Criar um grupo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DataTableServerPagination
        id="action-table"
        columns={columns}
        fetchData={fetchDataTable}
      />

      <SheetAction open={sheetActionOpen} onOpenChange={setSheetActionOpen} />

      <MoveToGroupModal
        open={moveGroupModalOpen}
        onOpenChange={setMoveGroupModalOpen}
      />

      {/* <AttachThumbList
        images={attach || []}
        open={attachModalOpen}
        onOpenChange={setAttachModalOpen}
      /> */}
    </div>
  )
}
