'use client'

import { EmissionProduct } from '@/@types/finance-emission'
import { AlertModal } from '@/components/alert-modal'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { currencyFormat } from '@/lib/currencyFormat'
import { useEmissionStore } from '@/store/financial/emission'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ProductModal } from './product-modal'

export function Grid() {
  const {
    fetchProductsData,
    editData,
    setEditData,
    deleteItemId,
    setDeleteItemId,
  } = useEmissionStore()
  const routeParams = useParams()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<EmissionProduct[]>({
    queryKey: [
      `financial/account/launch/${routeParams.type}/${routeParams.emissionId}`,
    ],
    queryFn: () =>
      fetchProductsData({
        emissionId: routeParams.emissionId as string,
        type: routeParams.type as string,
      }),
  })

  const columns: ColumnDef<EmissionProduct>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: (value) => {
        const id = value.getValue() as string
        const data = value.row.getAllCells()[0].row.original

        return (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => setDeleteItemId(id)}
            >
              <Trash2 size={12} />
            </Button>
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() => setEditData(data)}
            >
              <Pencil size={12} />
            </Button>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'item',
      header: 'Código',
    },
    {
      accessorKey: 'bound',
      header: 'Vinculo',
      cell: (value) => {
        return value.getValue() === 'BOUND' ? 'Vinculo' : 'Equipamento/OS'
      },
    },
    // {
    //   accessorKey: 'itemBounded',
    //   header: 'Item vinculado',
    // },
    {
      accessorFn: ({ material, input }) => {
        return routeParams.type === 'pagar' ? material?.label : input?.label
      },
      header: routeParams.type === 'pagar' ? 'Material' : 'Insumo',
    },
    {
      accessorKey: 'costCenter',
      header: 'centro de custo',
    },
    {
      accessorKey: 'compositionItem.label',
      header: 'item composição',
    },
    {
      accessorKey: 'price',
      header: 'Valor unitário',
      cell: (value) => {
        return currencyFormat(Number(value.getValue()))
      },
    },
    {
      accessorKey: 'quantity',
      header: 'qtd',
    },
    {
      accessorKey: 'total',
      header: 'total (R$)',
      cell: (value) => {
        return currencyFormat(Number(value.getValue()))
      },
    },
  ]

  async function deleteProduct() {
    const response = await api.delete(
      `financial/account/finance/${routeParams.emissionId}/item/${deleteItemId}`,
      {
        params: {
          application: `blank_financeiro_emissao_${routeParams.type}`,
        },
      },
    )

    // eslint-disable-next-line no-useless-return
    if (response.status !== 200) return

    const data =
      (await queryClient.getQueryData<EmissionProduct[]>([
        `financial/account/launch/${routeParams.type}/${routeParams.emissionId}`,
      ])) || []

    const updatedData = data.filter((item) => item.id !== Number(deleteItemId))
    console.log(updatedData)

    queryClient.setQueryData(
      [
        `financial/account/launch/${routeParams.type}/${routeParams.emissionId}`,
      ],
      updatedData,
    )
  }

  return (
    <>
      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
      <AlertModal
        open={!!deleteItemId}
        onOpenChange={(isOpen) =>
          setDeleteItemId(isOpen ? deleteItemId : undefined)
        }
        onConfirm={deleteProduct}
      />
      <ProductModal
        mode="edit"
        open={!!editData}
        onOpenChange={(isOpen) => setEditData(isOpen ? editData : undefined)}
      />
    </>
  )
}
