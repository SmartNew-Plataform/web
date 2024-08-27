'use client'

import { MaterialResponse } from '@/@types/maintenance/material'
import { AlertModal } from '@/components/alert-modal'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { currencyFormat } from '@/lib/currencyFormat'
import { ApiMaterialMapper } from '@/lib/mappers/api-material-mapper'
import { FormMaterialMapper } from '@/lib/mappers/form-material-mapper'
import { useLoading } from '@/store/loading-store'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Pencil, Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { FormSheet, MaterialFormData } from './form-sheet'

export function Table() {
  const params = useParams()
  const [materialId, setMaterialId] = useState<number | undefined>()
  const [materialData, setMaterialData] = useState<
    MaterialFormData | undefined
  >()
  const [materialDeleteId, setMaterialDeleteId] = useState<number | undefined>()
  const { toast } = useToast()
  const loading = useLoading()

  const { data, refetch } = useQuery({
    queryKey: ['maintenance/service-order/material'],
    queryFn: async () => {
      const response = await api.get(
        `/maintenance/service-order/${params.serviceOrderId}/material`,
      )

      if (response.status !== 200) return []

      return response.data.data
    },
  })

  async function handleUpdateMaterial(data: MaterialFormData) {
    const raw = ApiMaterialMapper.toApi(data)
    const response = await api.put(
      `/maintenance/service-order/${params.serviceOrderId}/material/${materialId}`,
      raw,
    )

    if (response.status !== 200) return response

    refetch()
    toast({
      title: 'Material atualizado com sucesso!',
      variant: 'success',
    })

    return response
  }

  async function handleDeleteMaterial() {
    loading.show()
    const response = await api
      .delete(
        `/maintenance/service-order/${params.serviceOrderId}/material/${materialDeleteId}`,
      )
      .finally(loading.hide)

    if (response.status !== 200) return response

    refetch()
    toast({
      title: 'Material deletado com sucesso!',
      variant: 'success',
    })

    return response
  }

  const columns: ColumnDef<MaterialResponse>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const data = row.original
        const raw = FormMaterialMapper.toForm(data)

        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() => {
                setMaterialData(raw)
                setMaterialId(data.id)
              }}
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => setMaterialDeleteId(data.id)}
            >
              <Trash size={14} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'code',
      header: 'Código',
    },
    {
      accessorKey: 'materials',
      header: 'Descrição',
      cell: ({ row }) => {
        const data = row.original
        return `${data.materials.code} - ${data.materials.material}`
      },
    },
    {
      accessorKey: 'unit',
      header: 'Unidade',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantidade',
    },
    {
      accessorKey: 'valueUnit',
      header: 'Valor Unidade',
      cell: ({ row }) => currencyFormat(row.getValue('valueUnit')),
    },
    {
      accessorKey: 'dateUse',
      header: 'Data uso',
      cell: ({ row }) => dayjs(row.getValue('dateUse')).format('DD/MM/YYYY'),
    },
    {
      accessorKey: 'serialNumberOld',
      header: 'N° serie antigo',
    },
    {
      accessorKey: 'serialNumberNew',
      header: 'N° serie novo',
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
        open={!!materialId}
        onOpenChange={(open) => setMaterialId(open ? materialId : undefined)}
        data={materialData}
        onSubmit={handleUpdateMaterial}
      />
      <AlertModal
        open={!!materialDeleteId}
        onOpenChange={(open) =>
          setMaterialDeleteId(open ? materialDeleteId : undefined)
        }
        onConfirm={handleDeleteMaterial}
      />
    </>
  )
}
