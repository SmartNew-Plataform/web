'use client'

import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useTasksBoundedStore } from '@/store/smartlist/smartlist-tasks-bounded'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ArrowDownWideNarrow, CornerDownLeft, Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export type TasksBoundedData = {
  id: number
  control: string
  description: string
}

interface TableTasksBounded {
  boundId: string
}

export function TableTasksBounded({ boundId }: TableTasksBounded) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { loadTasksBounded, loadTasks, loadControl } = useTasksBoundedStore(
    ({ tasksBounded, loadTasksBounded, loadTasks, loadControl }) => ({
      tasksBounded,
      loadTasksBounded,
      loadTasks,
      loadControl,
    }),
  )
  const searchParams = useSearchParams()
  const filterText = searchParams.get('s') || ''
  const { toast } = useToast()

  useQuery({
    queryKey: ['checklist/bound/task/selects'],
    queryFn: () => {
      loadTasks()
      loadControl()
    },
  })

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['checklist/bound/task', boundId, filterText],
    queryFn: () => loadTasksBounded({ boundId, filterText }),
  })

  async function handleDeleteTask() {
    const response = await api
      .delete(`/smart-list/bound/${boundId}/item/${deleteId}`)
      .then((res) => res.data)
      .catch((err: AxiosError<{ message: string }>) =>
        toast({
          title: err.response?.data.message,
          description: err.message,
          variant: 'destructive',
          duration: 1000 * 10,
        }),
      )

    if (!response.deleted) return

    toast({
      title: 'Vinculo deletado com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  const columns: ColumnDef<TasksBoundedData>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        const id = row.getValue('id') as number

        return (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => setDeleteId(id)}
              size="icon-xs"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )
      },
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
      accessorKey: 'control',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Controle
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  console.log(data)

  return (
    <>
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => setDeleteId(open ? deleteId : null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            Tem certeza que deseja deletar esse vinculo ?
          </AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <CornerDownLeft className="h-4 w-4" />
              Não, cancelar
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDeleteTask}>
                <Trash2 className="h-4 w-4" />
                Sim, deletar
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DataTable columns={columns} data={data || []} isLoading={isFetching} />
    </>
  )
}
