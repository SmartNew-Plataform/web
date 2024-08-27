'use client'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Expand } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
// import { useEffect, useState } from 'react'

const serviceOrderFromSchema = z.object({
  id: z.number(),
  codeServiceOrder: z.string().optional(),
  dateTimeRequest: z.coerce.date().optional(),
  dateEmission: z.coerce.date().optional(),
  equipment: z.string().optional(),
  descriptionRequest: z.string().optional(),
  closed: z.string().optional(),
  dateExpectedTerm: z.coerce.date().optional(),
  dateEnd: z.coerce.date().optional(),
  request: z.string().optional(),
  emission: z.string().optional(),
  openTime: z.string().optional(),
  datePrev: z.coerce.date().optional(),
  justification: z.string().optional(),
  status: z.string().optional(),
})

export type ServiceOrderFormData = z.infer<typeof serviceOrderFromSchema>

export function TableServiceOrder() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: serviceOrderFormData, isLoading } = useQuery({
    queryKey: ['maintenance-service-order-table'],
    queryFn: fetchDataTable,
  })

  async function fetchDataTable(): Promise<ServiceOrderFormData[]> {
    const response: { data: ServiceOrderFormData[] } = await api
      .get('/maintenance/service-order/list-table')
      .then((res) => res.data)

    if (response.data.length) {
      return response.data
    }

    return []
  }

  const columns: ColumnDef<ServiceOrderFormData>[] = [
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
                  `/manutencao/order-service/${id}/details?token=${searchParams.get('token')}`,
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
      accessorKey: 'request',
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
          return dayjs(line.getValue() as Date).format('DD/MM/YYYY HH:mm:ss')
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
          return dayjs(line.getValue() as Date).format('DD/MM/YYYY HH:mm:ss')
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
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={serviceOrderFormData || []}
      isLoading={isLoading}
    />
  )
}
