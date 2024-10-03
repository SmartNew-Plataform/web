'use client'

import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { EmissionType, useAccountStore } from '@/store/financial/account'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'

export function Grid() {
  const routeParams = useParams()
  const { setSelectedRows } = useAccountStore()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const filterText = searchParams.get('filterText')
  const column = searchParams.get('column')
  const value = searchParams.get('value')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const status = searchParams.getAll('status') || ''
  const paymentMethod = searchParams.getAll('paymentMethod') || ''

  const hasFilters =
    searchParams.has('filterText') ||
    searchParams.has('column') ||
    searchParams.has('value') ||
    searchParams.has('status') ||
    searchParams.has('paymentMethod')

  async function fetchDataTableFinanceEmission(params: {
    index: number
    perPage: number
  }) {
    const response = await api
      .get('/financial/account/', {
        params: {
          ...params,
          type: routeParams.type,
          filterText,
          [column || 'value']:
            from && to
              ? {
                  start: from || undefined,
                  end: to || undefined,
                }
              : (value ?? ''),
          status,
          paymentMethod,
        },
      })
      .then((res) => res.data)

    if (hasFilters) {
      toast({
        title: 'Filtros aplicados com sucesso!',
      })
    }

    return response
  }

  const columns: ColumnDef<EmissionType>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        const id = row.getAllCells()[0].row.original.financeId
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
            <Link
              href={{
                pathname: `${routeParams.type}/${id}`,
                query: { h: 'hidden' },
              }}
            >
              <Button size="icon-xs">
                <ExternalLink size={12} />
              </Button>
            </Link>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'process',
      header: 'proc.',
    },
    {
      accessorKey: 'number',
      header: 'N° fiscal',
    },
    {
      accessorKey: 'numberRequest',
      header: 'N° pedido',
    },
    {
      accessorKey: 'dateEmission',
      header: 'Data emissão',
      cell: (value) =>
        value.getValue()
          ? dayjs(String(value.getValue())).format('DD/MM/YYYY')
          : 'Sem registro',
    },
    {
      accessorKey: 'issue',
      header: 'Emitente',
    },
    {
      accessorKey: 'dueDate',
      header: 'Vencimento',
      cell: (value) =>
        value.getValue()
          ? dayjs(String(value.getValue())).format('DD/MM/YYYY')
          : 'Sem registro',
    },
    {
      accessorKey: 'prorogation',
      header: 'Prorrogação',
      cell: (value) =>
        value.getValue()
          ? dayjs(String(value.getValue())).format('DD/MM/YYYY')
          : 'Sem registro',
    },
    {
      accessorKey: 'expectDate',
      header: 'Data prevista',
      cell: (value) =>
        value.getValue()
          ? dayjs(String(value.getValue())).format('DD/MM/YYYY')
          : 'Sem registro',
    },
    {
      accessorKey: 'totalGross',
      header: 'total bruto',
      cell: (value) =>
        Number(value.getValue()).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      accessorKey: 'valuePay',
      header: 'valor parcela',
      cell: (value) =>
        Number(value.getValue()).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      accessorKey: 'totalLiquid',
      header: 'total liquido',
      cell: (value) =>
        Number(value.getValue()).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      accessorKey: 'numberSplit',
      header: 'n° prc.',
    },
    {
      accessorKey: 'status',
      header: 'status',
    },
  ]

  function handleSelectRows(rows: EmissionType[]) {
    setSelectedRows(rows)
  }

  return (
    <DataTableServerPagination
      id={[
        'finance-emission-table',
        filterText || '',
        column || '',
        value || '',
        from || '',
        to || '',
        ...status,
        ...paymentMethod,
      ]}
      columns={columns}
      fetchData={fetchDataTableFinanceEmission}
      onRowSelection={handleSelectRows}
    />
  )
}
