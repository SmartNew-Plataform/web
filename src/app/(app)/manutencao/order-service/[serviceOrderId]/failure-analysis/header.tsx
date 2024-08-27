'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ApiFailureAnalysisMapper } from '@/lib/mappers/api-failure-analysis-mapper'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { FailureAnalysisFormData, FormSheet } from './form-sheet'

export function Header() {
  const params = useParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  async function handleCreateFailureAnalysis(data: FailureAnalysisFormData) {
    const raw = ApiFailureAnalysisMapper.toApi(data)
    const response = await api.post(
      `/maintenance/service-order/${params.serviceOrderId}/failure-analysis`,
      raw,
    )

    if (response.status !== 201) return response

    toast({
      title: 'Analise criado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['maintenance/service-order/failure-analysis'])

    return response
  }

  return (
    <PageHeader>
      <h2 className="text-xl font-bold text-slate-700">Analise de falhas</h2>

      <FormSheet onSubmit={handleCreateFailureAnalysis}>
        <Button>
          <Plus size={16} />
          Novo
        </Button>
      </FormSheet>
    </PageHeader>
  )
}
