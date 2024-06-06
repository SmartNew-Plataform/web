'use client'

import { DataTable } from '@/components/data-table'
import { useBoundStore } from '@/store/smartlist/smartlist-bound'
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
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import {
  ArrowDownWideNarrow,
  CornerDownLeft,
  ExternalLink,
  Pencil,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SheetEditBound } from './sheet-edit-bound'

export type BoundData = {
  id: number
  family: string
  description: string
}

export function TableBounds() {
  const { loadBounds } = useBoundStore(({ loadBounds }) => ({
    loadBounds,
  }))
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const filterText = searchParams.get('s') || ''

  const { data, refetch } = useQuery({
    queryKey: ['checklist/bounds', filterText],
    queryFn: () => loadBounds({ filterText }),
  })

  const columnsBound: ColumnDef<BoundData>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        const id = row.getValue('id') as number

        return (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => setDeleteId(id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() => setEditId(id)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="secondary" size="icon-xs" asChild>
              <Link
                href={{
                  pathname: `/checklist/vinculos/${id}`,
                  query: {
                    token: searchParams.get('token'),
                  },
                }}
              >
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Familia/locação
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
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
  ]

  async function handleDeleteBound() {
    const response = await api
      .delete(`/smart-list/bound/${deleteId}`)
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

  return (
    <>
      <SheetEditBound onOpenChange={setEditId} boundId={editId} />
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
              <Button variant="destructive" onClick={handleDeleteBound}>
                <Trash2 className="h-4 w-4" />
                Sim, deletar
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DataTable columns={columnsBound} data={data || []} isLoading={!data} />
    </>
  )
}
