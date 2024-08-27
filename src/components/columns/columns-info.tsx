'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowDownWideNarrow, ExternalLink, Trash2 } from 'lucide-react'
import Link from 'next/link'

export type InfoData = {
  id: number
  status: string
  startDate: string | null
  item: string
  user: string
  period: string
}

export const columns: (
  onDeleteClick: (id: number) => void,
  // onRowSelectionChange: (selectedRows: InfoData[]) => void,
) => ColumnDef<InfoData>[] = (onDeleteClick) => {
  return [
    {
      accessorKey: 'id',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => {
        const infoData = row.original as InfoData
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Selecionar linha"
            />
            <Button variant="secondary" size="icon-xs" asChild>
              <Link
                href={`/checklist/grid/${infoData.id}?token=${new URLSearchParams(
                  window.location.search,
                ).get('token')}`}
              >
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>

            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => onDeleteClick(Number(infoData.id))}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          N° Checklist
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'model',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tipo Checklist
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data de abertura
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date: string = row.getValue('startDate')
        return date ? dayjs(date).format('DD/MM/YYYY, HH:mm') : 'Sem registro'
      },
    },
    {
      accessorKey: 'period',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Turno
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'item',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ativo/Diversos
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'user',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Usuário
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ]
}
