'use client'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ApiStopRecordingMapper } from '@/lib/mappers/api-stop-recording-mapper'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { FormSheet, StopRecordingFormData } from './form-sheet'

export function Header() {
  const params = useParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  async function handleCreateStopRecording(data: StopRecordingFormData) {
    console.log(data)
    const raw = ApiStopRecordingMapper.toApi(data)
    const response = await api
      .post(
        `/maintenance/service-order/${params.serviceOrderId}/note-stop`,
        raw,
      )
      .catch((err) => {
        console.error(err)
        return err
      })

    if (response.status !== 201) return response

    queryClient.refetchQueries(['maintenance/service-order/stop-recording'])
    toast({
      title: 'Registro de parada cadastrado com sucesso!',
      variant: 'success',
    })

    return response
  }

  return (
    <PageHeader>
      <h2 className="text-xl font-bold text-slate-700">Registro de paradas</h2>

      <FormSheet onSubmit={handleCreateStopRecording}>
        <Button>
          <Plus size={16} />
          Novo
        </Button>
      </FormSheet>
    </PageHeader>
  )
}
