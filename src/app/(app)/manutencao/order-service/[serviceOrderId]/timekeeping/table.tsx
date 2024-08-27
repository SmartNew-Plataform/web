'use client'

import { TimekeepingResponse } from '@/@types/maintenance/timekeeping'
import { AlertModal } from '@/components/alert-modal'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ApiTimeKeepingMapper } from '@/lib/mappers/api-timekeeping-mapper'
import { FormTimeKeepingMapper } from '@/lib/mappers/form-timekeeping-mapper'
import { useLoading } from '@/store/loading-store'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Pencil, Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { FormSheet, TimeKeepingFormData } from './form-sheet'

export function Table() {
  const params = useParams()
  const { toast } = useToast()
  const [timekeepingId, setTimekeepingId] = useState<number | undefined>()
  const [timekeepingData, setTimekeepingData] = useState<
    TimeKeepingFormData | undefined
  >()
  const [timekeepingIdToDelete, setTimekeepingIdToDelete] = useState<
    number | undefined
  >()
  const loading = useLoading()

  const { data, refetch } = useQuery({
    queryKey: [
      `maintenance/service-order/${params.serviceOrderId}/timekeeping`,
    ],
    queryFn: async () => {
      const response = await api.get(
        `/maintenance/service-order/${params.serviceOrderId}/note`,
      )

      if (response.status !== 200) return []

      return response.data.data
    },
  })

  async function handleUpdateTimekeeping(data: TimeKeepingFormData) {
    const raw = ApiTimeKeepingMapper.toApi(data)
    const response = await api.put(
      `/maintenance/service-order/${params.serviceOrderId}/note/${timekeepingId}`,
      raw,
    )

    if (response.status !== 200) return response

    refetch()
    toast({
      title: 'Apontamento de horas foi atualizado com sucesso!',
      variant: 'success',
    })

    return response
  }

  async function handleDeleteTimekeeping() {
    loading.show()
    const response = await api
      .delete(
        `/maintenance/service-order/${params.serviceOrderId}/note/${timekeepingIdToDelete}`,
      )
      .finally(() => loading.hide())

    if (response.status !== 200) return response

    refetch()
    toast({
      title: 'Apontamento de horas foi deletado com sucesso!',
      variant: 'success',
    })
  }

  const columns: ColumnDef<TimekeepingResponse>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const data = row.original
        const raw = FormTimeKeepingMapper.toForm(data)

        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() => {
                setTimekeepingId(row.getValue('id'))
                setTimekeepingData(raw)
              }}
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => setTimekeepingIdToDelete(data.id)}
            >
              <Trash size={14} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'relatedEmployee.name',
      header: 'Colaborador',
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'date',
      header: 'Data',
      cell: ({ row }) => dayjs(row.getValue('date')).format('DD/MM/YYYY'),
    },
    {
      accessorKey: 'dateStartHour',
      header: 'Inicio',
      cell: ({ row }) => dayjs(row.getValue('dateStartHour')).format('HH:mm'),
    },
    {
      accessorKey: 'dateEndHour',
      header: 'Termino',
      cell: ({ row }) => dayjs(row.getValue('dateEndHour')).format('HH:mm'),
    },
    {
      accessorKey: 'dateEmission',
      header: 'Tempo real',
      cell: ({ row }) => dayjs(row.getValue('dateEmission')).format('HH:mm'),
    },
    {
      accessorKey: 'relatedStatusServiceOrder.status',
      header: 'Status O.S.',
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={data || []} />
      <FormSheet
        open={!!timekeepingId}
        onOpenChange={(open) =>
          setTimekeepingId(open ? timekeepingId : undefined)
        }
        onSubmit={handleUpdateTimekeeping}
        data={timekeepingData}
      />

      <AlertModal
        open={!!timekeepingIdToDelete}
        onOpenChange={(open) =>
          setTimekeepingIdToDelete(open ? timekeepingIdToDelete : undefined)
        }
        onConfirm={handleDeleteTimekeeping}
      />
    </>
  )
}
