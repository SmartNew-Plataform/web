'use client'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ApiDiverseMapper } from '@/lib/mappers/api-diverse-mapper'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { DiverseFormData, FormSheet } from './form-sheet'

export function Header() {
  const params = useParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  async function handleCreateDiverse(data: DiverseFormData) {
    const raw = ApiDiverseMapper.toApi(data)
    const response = await api
      .post(`/maintenance/service-order/${params.serviceOrderId}/cost`, raw)
      .catch((err) => {
        console.error(err)
        return err
      })

    if (response.status !== 201) return response

    queryClient.refetchQueries(['maintenance/service-order/cost'])
    toast({
      title: 'Diverso criado com sucesso!',
      variant: 'success',
    })

    return response
  }
  return (
    <PageHeader>
      <h2 className="text-xl font-bold text-slate-700">Diversos</h2>

      <FormSheet onSubmit={handleCreateDiverse}>
        <Button>
          <Plus size={16} />
          Novo
        </Button>
      </FormSheet>
    </PageHeader>
  )
}
