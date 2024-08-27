'use client'

import { FailureAnalysisResponse } from '@/@types/maintenance/failure-analysis'
import { AlertModal } from '@/components/alert-modal'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ApiFailureAnalysisMapper } from '@/lib/mappers/api-failure-analysis-mapper'
import { FormFailureAnalysis } from '@/lib/mappers/form-failure-analysis'
import { useLoading } from '@/store/loading-store'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { FailureAnalysisFormData, FormSheet } from './form-sheet'

export function Table() {
  const params = useParams()
  const [failureAnalysisId, setFailureAnalysisId] = useState<
    number | undefined
  >()
  const [failureAnalysisData, setFailureAnalysisData] = useState<
    FailureAnalysisFormData | undefined
  >()
  const [failureAnalysisDeleteId, setFailureAnalysisDeleteId] = useState<
    number | undefined
  >()
  const { toast } = useToast()
  const loading = useLoading()

  const { data, refetch } = useQuery({
    queryKey: ['maintenance/service-order/failure-analysis'],
    queryFn: async () => {
      const response = await api.get(
        `/maintenance/service-order/${params.serviceOrderId}/failure-analysis`,
      )

      return response.data.data
    },
  })

  async function handleUpdateFailureAnalysis(data: FailureAnalysisFormData) {
    const raw = ApiFailureAnalysisMapper.toApi(data)
    const response = await api.put(
      `/maintenance/service-order/${params.serviceOrderId}/failure-analysis/${failureAnalysisId}`,
      raw,
    )

    if (response.status !== 200) return response

    refetch()
    toast({
      title: 'Analise atualizado com sucesso!',
      variant: 'success',
    })

    return response
  }

  async function handleDeleteFailureAnalysis() {
    loading.show()
    const response = await api
      .delete(
        `/maintenance/service-order/${params.serviceOrderId}/failure-analysis/${failureAnalysisDeleteId}`,
      )
      .finally(loading.hide)

    if (response.status !== 200) return response

    refetch()
    toast({
      title: 'Analise deletado com sucesso!',
      variant: 'success',
    })

    return response
  }

  const columns: ColumnDef<FailureAnalysisResponse>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const data = row.original
        const raw = FormFailureAnalysis.toForm(data)

        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() => {
                setFailureAnalysisData(raw)
                setFailureAnalysisId(data.id)
              }}
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => setFailureAnalysisDeleteId(data.id)}
            >
              <Trash size={14} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'relatedComponent.component',
      header: 'Componente',
    },
    {
      accessorKey: 'relatedFailureSymptoms.description',
      header: 'Sintoma',
    },
    {
      accessorKey: 'relatedFailureCause.description',
      header: 'Causa',
    },
    {
      accessorKey: 'relatedFailureAction.description',
      header: 'Ação',
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={data || []} />
      <FormSheet
        open={!!failureAnalysisId}
        onOpenChange={(open) =>
          setFailureAnalysisId(open ? failureAnalysisId : undefined)
        }
        data={failureAnalysisData}
        onSubmit={handleUpdateFailureAnalysis}
      />
      <AlertModal
        open={!!failureAnalysisDeleteId}
        onOpenChange={(open) =>
          setFailureAnalysisDeleteId(open ? failureAnalysisDeleteId : undefined)
        }
        onConfirm={handleDeleteFailureAnalysis}
      />
    </>
  )
}
