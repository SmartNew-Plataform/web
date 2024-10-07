'use client'
import { AdvancedFilter } from '@/components/advanced-filter'
import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { Button } from '@/components/ui/button'
import { useFilters } from '@/hooks/use-filters'
import { api } from '@/lib/api'
import {
  StatusFilterData,
  useServiceOrder,
} from '@/store/maintenance/service-order'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Expand } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export type ServiceOrderData = {
  id: number
  codeServiceOrder: string
  dateTimeRequest: string
  dateEmission: string
  equipment: string
  descriptionRequest: string
  closed: string
  dateExpectedTerm: string
  dateEnd: string
  request: string
  emission: string
  openTime: string
  datePrev: string
  justification: string
  status: {
    value: string
    label: string
    color: string
  }
}

export function TableServiceOrder() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { selects, statusFilterValue, setStatusFilterData } = useServiceOrder()
  const filterServiceOrder = useFilters({
    defaultValues: { status: selects.status ? [selects.status[0].value] : [] },
    options: [
      {
        label: 'Ordem',
        value: 'codeServiceOrder',
        type: 'text',
      },
      {
        label: 'Equipamento',
        value: 'equipment',
        type: 'select',
        options: selects.equipment,
      },
      {
        label: 'Solicitante',
        value: 'requester',
        type: 'select',
        options: selects.requester,
      },
      {
        label: 'Descrição',
        value: 'descriptionRequest',
        type: 'text',
      },
      {
        label: 'Data Emissão',
        value: 'dateEmission',
        type: 'date',
      },
      {
        label: 'Data Solicitações',
        value: 'dateTimeRequest',
        type: 'date',
      },
      {
        label: 'Data Prevista Termino',
        value: 'dateExpectedEnd',
        type: 'date',
      },
      {
        label: 'Justificativa',
        value: 'justification',
        type: 'text',
      },
      {
        label: 'Status',
        value: 'status',
        type: 'select',
        options: selects.status,
      },
    ],
  })
  const { filterData } = filterServiceOrder

  async function fetchDataTable(data: {
    index: number
    perPage: number
  }): Promise<{ rows: ServiceOrderData[]; pageCount: number }> {
    const response = await api
      .get<{
        rows: ServiceOrderData[]
        pageCount: number
        filterStatus: StatusFilterData[]
      }>('/maintenance/service-order/list-table', {
        params: {
          ...data,
          ...filterData,
          statusOS: statusFilterValue,
        },
      })
      .then((res) => res.data)

    if (response.rows.length) {
      setStatusFilterData(response.filterStatus)
      return response
    }

    return { rows: [], pageCount: 0 }
  }

  const columns: ColumnDef<ServiceOrderData>[] = [
    {
      accessorKey: 'expand',
      header: '',
      cell: (line) => {
        const { id } = line.row.original as { id: number }
        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() => {
                // setIndexModal(line.row.index)
                // setChildrenData(children)
                router.push(
                  `/manutencao/order-service/${id}/details?token=${searchParams.get('token')}&h=hidden`,
                )
              }}
            >
              <Expand size={12} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'codeServiceOrder',
      header: 'Ordem',
    },
    {
      accessorKey: 'equipment',
      header: 'Equipamento',
    },
    {
      accessorKey: 'requester',
      header: 'Solicitante',
    },
    {
      accessorKey: 'descriptionRequest',
      header: 'Descrição',
    },
    {
      accessorKey: 'dateEmission',
      header: 'Data Emissão',
      cell: (line) => {
        return dayjs(line.getValue() as Date).format('DD/MM/YYYY HH:mm:ss')
      },
    },
    {
      accessorKey: 'dateTimeRequest',
      header: 'Data solicitação',
      cell: (line) => {
        if (line.getValue() !== null) {
          const date = line.getValue() as string

          return dayjs(date).format('DD/MM/YYYY')
        } else return 'Sem Registro'
      },
    },
    {
      accessorKey: 'openTime',
      header: 'T.aberto',
    },
    {
      accessorKey: 'dateExpectedTerm',
      header: 'Data Prevista Termino',
      cell: (line) => {
        if (line.getValue() !== null) {
          return line.getValue()
            ? dayjs(line.getValue() as Date).format('DD/MM/YYYY HH:mm:ss')
            : ''
        } else return 'Sem Registro'
      },
    },
    {
      accessorKey: 'justification',
      header: 'Justificativa',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (row) => {
        const status = row.getValue() as ServiceOrderData['status']
        return (
          <span
            className="whitespace-nowrap rounded-full border px-2 py-1 text-sm font-semibold text-slate-600"
            style={{
              borderColor: status.color,
              background: `${status.color}20`,
            }}
          >
            {status.label}
          </span>
        )
      },
    },
  ]

  return (
    <div className="flex h-full flex-1 flex-col gap-4 overflow-auto">
      <AdvancedFilter {...filterServiceOrder} />
      <DataTableServerPagination
        fetchData={fetchDataTable}
        id={[
          'maintenance-service-order-table',
          ...(Object.values(filterData) as string[]),
          statusFilterValue || '',
        ]}
        columns={columns}
      />
    </div>
  )
}
