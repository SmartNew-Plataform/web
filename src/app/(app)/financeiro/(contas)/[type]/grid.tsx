'use client'

import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/lib/api'
import { EmissionType, useAccountStore } from '@/store/financial/account'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function Grid() {
  const searchParams = useSearchParams()
  const routeParams = useParams()
  const { selectedRows, setSelectedRows } = useAccountStore()

  useEffect(() => {
    console.log(searchParams.toString())
  }, [searchParams])

  async function fetchDataTableFinanceEmission(params: {
    index: number
    perPage: number
  }) {
    return api
      .get('/financial/account/', {
        params: {
          ...params,
          type: routeParams.type,
        },
      })
      .then((res) => res.data)
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
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'process',
      header: 'N° prorrogação',
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
      header: 'n° parcela',
    },
    {
      accessorKey: 'status',
      header: 'status',
    },
  ]

  return (
    <DataTableServerPagination
      id="finance-emission-table"
      columns={columns}
      fetchData={fetchDataTableFinanceEmission}
      onRowSelection={(rows: EmissionType[]) => setSelectedRows(rows)}
    />
  )
}
