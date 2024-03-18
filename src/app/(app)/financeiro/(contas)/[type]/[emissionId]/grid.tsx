'use client'

import { AlertModal } from '@/components/alert-modal'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { currencyFormat } from '@/lib/currencyFormat'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { ProductData, ProductModal } from './product-modal'

interface CompositionItem {
  value: number
  label: string
}

interface LaunchItemType {
  id: number
  item: string
  bound: 'stock' | 'equipment' | 'order'
  total: string
  compositionItem: CompositionItem
  input: string
  material: string
  equipment: string[]
  order: string[]
  quantity: string
  price: string
}

export function Grid() {
  const routeParams = useParams()
  const [deleteItemId, setDeleteItemId] = useState<string | undefined>(
    undefined,
  )
  const [editData, setEditData] = useState<ProductData | undefined>(undefined)

  async function fetchData() {
    const response = await api
      .get(`financial/account/finance/${routeParams.emissionId}/item`, {
        params: {
          application: `blank_financeiro_emissao_${routeParams.type}`,
        },
      })
      .then((res) => res.data)

    return response.data
  }

  const { data, isLoading } = useQuery({
    queryKey: ['financial/account/launch/grid'],
    queryFn: fetchData,
  })

  const columns: ColumnDef<LaunchItemType>[] = [
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
              // onClick={() =>
              //   setEditData({
              //     bound: data.bound,
              //   })
              // }
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
        return routeParams.type === 'pagar' ? material : input
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
    },
  ]

  function deleteProduct() {}

  console.log(deleteItemId)

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
