'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowDownWideNarrow, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export type InfoData = {
  id: number
  status: string
  startDate: string | null
  item: string
  user: string
  period: string
}

export const columns: ColumnDef<InfoData>[] = [
  {
    header: () => <span />,
    accessorKey: 'id',
    cell: ({ row }) => {
      if (!window) return
      const searchParams = new URLSearchParams(window.location.search)
      const token = searchParams.get('token')
      const id = row.getValue('id')
      return (
        <Button variant="secondary" size="icon-xs" asChild>
          <Link href={`/checklist/grid/${id}?token=${token}`}>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      )
    },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Id
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'model',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Modelo
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
          Data de abertura
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date: string = row.getValue('startDate')

      return date ? dayjs(date).format('DD/MM/YYYY, HH:mm') : 'Sem registro'
    },
  },
  {
    accessorKey: 'period',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Turno
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'item',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ativo/Diversos
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'user',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Usuario
          <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) =>
      row.getValue('status') === 'open' ? 'Aberto' : 'Finalizado ',
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
