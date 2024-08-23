'use client'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ApiMaterialMapper } from '@/lib/mappers/api-material-mapper'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { FormSheet, MaterialFormData } from './form-sheet'

export function Header() {
  const params = useParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  async function handleCreateMaterial(data: MaterialFormData) {
    const raw = ApiMaterialMapper.toApi(data)
    const response = await api.post(
      `/maintenance/service-order/${params.serviceOrderId}/material`,
      raw,
    )

    if (response.status !== 201) return response

    toast({
      title: 'Material criado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['maintenance/service-order/material'])

    return response
  }

  return (
    <PageHeader>
      <h2 className="text-xl font-bold text-slate-700">Matérias</h2>

      <FormSheet onSubmit={handleCreateMaterial}>
        <Button>
          <Plus size={16} />
          Novo
        </Button>
      </FormSheet>
    </PageHeader>
  )
}
