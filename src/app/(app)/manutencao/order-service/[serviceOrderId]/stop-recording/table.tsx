'use client'
import { StopRecordingResponse } from '@/@types/maintenance/stop-recording'
import { AlertModal } from '@/components/alert-modal'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ApiStopRecordingMapper } from '@/lib/mappers/api-stop-recording-mapper'
import { FormStopRecodingMapper } from '@/lib/mappers/form-stop-recording-mapper'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Pencil, Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { FormSheet, StopRecordingFormData } from './form-sheet'

export function Table() {
  const params = useParams()
  const [stopRecordingDeleteId, setStopRecordingDeleteId] = useState<
    number | undefined
  >()
  const [stopRecordingId, setStopRecordingId] = useState<number | undefined>()
  const [stopRecordingData, setStopRecordingData] = useState<
    StopRecordingFormData | undefined
  >()
  const { toast } = useToast()

  const { data, refetch } = useQuery({
    queryKey: ['maintenance/service-order/stop-recording'],
    queryFn: async () => {
      const response = await api.get(
        `/maintenance/service-order/${params.serviceOrderId}/note-stop`,
      )

      if (response.status !== 200) return []

      return response.data.data
    },
  })

  async function handleUpdateStopRecording(data: StopRecordingFormData) {
    const raw = ApiStopRecordingMapper.toApi(data)
    const response = await api.put(
      `/maintenance/service-order/${params.serviceOrderId}/note-stop/${stopRecordingId}`,
      raw,
    )

    if (response.status !== 200) return response

    toast({
      title: 'Registro de parada atualizado com sucesso!',
      variant: 'success',
    })
    refetch()

    return response
  }

  async function handleDeleteStopRecording() {
    const response = await api.delete(
      `/maintenance/service-order/${params.serviceOrderId}/note-stop/${stopRecordingDeleteId}`,
    )

    if (response.status !== 200) return

    toast({
      title: 'Registro de parada deletado com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  const columns: ColumnDef<StopRecordingResponse>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const data = row.original
        const raw = FormStopRecodingMapper.toForm(data)

        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() => {
                setStopRecordingId(data.id)
                setStopRecordingData(raw)
              }}
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => setStopRecordingDeleteId(data.id)}
            >
              <Trash size={14} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'dateStartHour',
      header: 'Data hora parou',
      cell: ({ row }) => {
        return dayjs(row.getValue('dateStartHour')).format('DD/MM/YYYY HH:mm')
      },
    },
    {
      accessorKey: 'dateEndHour',
      header: 'Data hora funcionou',
      cell: ({ row }) => {
        return dayjs(row.getValue('dateEndHour')).format('DD/MM/YYYY HH:mm')
      },
    },
    {
      accessorKey: 'comments',
      header: 'Observações',
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={data || []} />
      <FormSheet
        open={!!stopRecordingId}
        onOpenChange={(open) =>
          setStopRecordingId(open ? stopRecordingId : undefined)
        }
        onSubmit={handleUpdateStopRecording}
        data={stopRecordingData}
      />
      <AlertModal
        open={!!stopRecordingDeleteId}
        onOpenChange={(open) =>
          setStopRecordingDeleteId(open ? stopRecordingDeleteId : undefined)
        }
        onConfirm={handleDeleteStopRecording}
      />
    </>
  )
}
