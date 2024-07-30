'use client'
import { DataTable } from '@/components/data-table'
import { api } from '@/lib/api'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Expand } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { useQuery } from '@tanstack/react-query'
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
  // const [data, setData] = useState([])
  const { setSelects } = useServiceOrder()

  async function fetchSelects() {
    const [branch, allEquipment, allTypeMaintenance] = await Promise.all([
      await api.get('system/list-branch').then((res) => res.data.data),
      await api.get('system/equipment').then((res) => res.data.data),
      await api.get('maintenance/type').then((res) => res.data.data),
    ])
    // console.log('branch => ', branch)

    setSelects({
      branch: branch.map(
        ({ value, label }: { value: string; label: string }) => {
          return {
            value,
            label,
          }
        },
      ),
      equipment: allEquipment.map(
        (value: { id: number; equipmentCode: string; description: string }) => {
          return {
            value: value.id.toString(),
            label: `${value.equipmentCode} - ${value.description}`,
          }
        },
      ),
      typeMaintenance: allTypeMaintenance.map(
        (value: { id: number; typeMaintenance: string }) => {
          return {
            value: value.id.toString(),
            label: value.typeMaintenance,
          }
        },
      ),
    })
  }

  const { data: ServiceOrderFormData } = useQuery({
    queryKey: ['maintenance-service-order-table'],
    queryFn: fetchDataTable,
  })

  useQuery({
    queryKey: ['maintenance-service-order-selects'],
    queryFn: fetchSelects,
  })

  async function fetchDataTable(): Promise<ServiceOrderFormData[]> {
    const response: { data: ServiceOrderFormData[] } = await api
      .get('/maintenance/service-order/list-table', {
        // params,
      })
      .then((res) => res.data)

    // console.log('response => ', response)
    if (response.data.length) {
      // console.log('data => ', response)
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
                console.log(id)
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

  // useEffect(() => {
  //   async function fetchDataTable(params: { index: number; perPage: number }) {
  //     const response = await api
  //       .get('/maintenance/service-order/list-table', {
  //         params,
  //       })
  //       .then((res) => res.data)

  //     // console.log('response => ', response)

  //     setData(response.data)
  //     // return {
  //     //   rows: data,
  //     //   pageCount: 10,
  //     // }
  //   }

  //   fetchDataTable({ index: 0, perPage: 10 })
  // }, [])
  // console.log('data=> ', data)
  return (
    <DataTable
      columns={columns}
      data={ServiceOrderFormData || []}
      // filterText={infoScreen?.filter?.filterText}
      // dateFrom={infoScreen?.filter?.period?.from}
      // dateTo={infoScreen?.filter?.period?.to}
    />
  )
}
