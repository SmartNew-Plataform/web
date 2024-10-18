'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ExternalLink, Trash2 } from 'lucide-react'
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
      accessorKey: 'btn',
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
                href={`/checklist/grid/${infoData.id}?${new URLSearchParams(
                  window.location.search,
                ).toString()}`}
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
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'N° Checklist',
    },
    {
      accessorKey: 'model',
      header: 'Tipo Checklist',
    },
    {
      accessorKey: 'startDate',
      header: 'Data de abertura',
      cell: ({ row }) => {
        const date: string = row.getValue('startDate')
        return date ? dayjs(date).format('DD/MM/YYYY, HH:mm') : 'Sem registro'
      },
    },
    {
      accessorKey: 'period',
      header: 'Turno',
    },
    {
      accessorKey: 'item',
      header: 'Ativo/Diversos',
    },
    {
      accessorKey: 'user',
      header: 'Usuário',
    },
  ]
}
