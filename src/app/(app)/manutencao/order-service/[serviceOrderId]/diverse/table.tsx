'use client'
import { DiverseResponse } from '@/@types/maintenance/diverse'
import { AlertModal } from '@/components/alert-modal'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { currencyFormat } from '@/lib/currencyFormat'
import { ApiDiverseMapper } from '@/lib/mappers/api-diverse-mapper'
import { FormDiversMapper } from '@/lib/mappers/form-diverse-mapper'
import { useLoading } from '@/store/loading-store'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Pencil, Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { DiverseFormData, FormSheet } from './form-sheet'

export function Table() {
  const [diverseId, setDiverseId] = useState<number | undefined>()
  const [diverseData, setDiverseData] = useState<DiverseFormData | undefined>()
  const [diverseDeleteId, setDiverseDeleteId] = useState<number | undefined>()
  const params = useParams()
  const { toast } = useToast()
  const loading = useLoading()

  const { data, refetch } = useQuery({
    queryKey: ['maintenance/service-order/cost'],
    queryFn: async () => {
      const response = await api.get(
        `/maintenance/service-order/${params.serviceOrderId}/cost`,
      )

      if (response.status !== 200) return []

      return response.data.data
    },
  })

  async function handleUpdateDiverse(data: DiverseFormData) {
    const raw = ApiDiverseMapper.toApi(data)
    const response = await api
      .put(
        `/maintenance/service-order/${params.serviceOrderId}/cost/${diverseId}`,
        raw,
      )
      .catch((err) => {
        console.error(err)
        return err
      })

    if (response.status !== 200) return response

    refetch()
    toast({
      title: 'Diverso atualizado com sucesso!',
      variant: 'success',
    })

    return response
  }

  async function handleDeleteDiverse() {
    loading.show()
    const response = await api
      .delete(
        `/maintenance/service-order/${params.serviceOrderId}/cost/${diverseDeleteId}`,
      )
      .finally(loading.hide)
      .catch((err) => {
        console.error(err)
        return err
      })

    if (response.status !== 200) return response

    refetch()
    toast({
      title: 'Diverso deletado com sucesso!',
      variant: 'success',
    })

    return response
  }

  const columns: ColumnDef<DiverseResponse>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const data = row.original
        const raw = FormDiversMapper.toForm(data)

        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() => {
                setDiverseData(raw)
                setDiverseId(data.id)
              }}
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => setDiverseDeleteId(data.id)}
            >
              <Trash size={14} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'relatedDescriptionCostServiceOrder.description',
      header: 'Descrição',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantidade',
    },
    {
      accessorKey: 'valueUnit',
      header: 'Custo unitário',
      cell: ({ row }) => currencyFormat(row.getValue('valueUnit')),
    },
    {
      accessorKey: 'cost',
      header: 'total',
      cell: ({ row }) => currencyFormat(row.getValue('cost')),
    },
    {
      accessorKey: 'dateCost',
      header: 'Data',
      cell: ({ row }) => dayjs(row.getValue('dateCost')).format('DD/MM/YYYY'),
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
        open={!!diverseId}
        onOpenChange={(open) => setDiverseId(open ? diverseId : undefined)}
        data={diverseData}
        onSubmit={handleUpdateDiverse}
      />
      <AlertModal
        open={!!diverseDeleteId}
        onOpenChange={(open) =>
          setDiverseDeleteId(open ? diverseDeleteId : undefined)
        }
        onConfirm={handleDeleteDiverse}
      />
    </>
  )
}
