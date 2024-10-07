'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ApiTimeKeepingMapper } from '@/lib/mappers/api-timekeeping-mapper'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { FormSheet, TimeKeepingFormData } from './form-sheet'

export function Header() {
  const params = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleCreateTimeKeeping(data: TimeKeepingFormData) {
    const raw = ApiTimeKeepingMapper.toApi(data)

    const response = await api
      .post(`/maintenance/service-order/${params.serviceOrderId}/note`, raw)
      .catch((err) => {
        console.error(err)
        return err
      })

    console.log(response)

    if (response.status !== 201) return response

    toast({
      title: 'Apontamento de hora criado om sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries([
      `maintenance/service-order/${params.serviceOrderId}/timekeeping`,
    ])

    return response
  }
  return (
    <PageHeader>
      <h2 className="text-xl font-bold text-slate-700">Apontamento de horas</h2>

      <FormSheet onSubmit={handleCreateTimeKeeping}>
        <Button>
          <Plus size={16} />
          Novo
        </Button>
      </FormSheet>
    </PageHeader>
  )
}
