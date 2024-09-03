'use client'
import { AlertModal } from '@/components/alert-modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ProductModal } from './Primary-modal'

export interface Product {
  id: number
  description: string
  unity: string
}

async function fetchProduct(): Promise<Product[]> {
  const response = await api.get('fuelling/product')
  return response.data.data || []
}

export function FuelList() {
  const queryClient = useQueryClient()
  const { data: fuelData = [] } = useQuery({
    queryKey: ['fuelling/product'],
    queryFn: fetchProduct,
    refetchInterval: 20 * 1000,
  })

  const [openModal, setOpenModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
    null,
  )

  function handleEdit(product: Product) {
    setSelectedProduct(product)
    setOpenModal(true)
  }

  async function handleDeleteProduct() {
    if (productIdToDelete === null) return

    try {
      const response = await api.delete(`fuelling/product/${productIdToDelete}`)
      if (response.status === 200) {
        toast({ title: 'Produto deletado com sucesso!', variant: 'success' })
        setProductIdToDelete(null)
        queryClient.invalidateQueries(['fuelling/product'])
      }
    } catch (error) {
      toast({ title: 'Erro ao deletar produto!', variant: 'destructive' })
    }
  }

  return (
    <div className="grid max-h-full grid-cols-auto gap-4 overflow-auto">
      {fuelData.map((product) => (
        <Card key={product.id} className="flex flex-col justify-between p-4">
          <div className="flex gap-2 self-end">
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={() => handleEdit(product)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon-sm"
              onClick={() => setProductIdToDelete(product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="max-w-full flex-1 truncate">
                {product.description} - {product.unity}
              </span>
            </TooltipTrigger>
            <TooltipContent>{product.description}</TooltipContent>
          </Tooltip>
        </Card>
      ))}

      {selectedProduct && (
        <ProductModal
          mode="edit"
          open={openModal}
          onOpenChange={setOpenModal}
          defaultValues={selectedProduct}
          productId={selectedProduct.id}
        />
      )}

      <AlertModal
        open={!!productIdToDelete}
        onOpenChange={(open) => {
          if (!open) setProductIdToDelete(null)
        }}
        onConfirm={handleDeleteProduct}
      />
    </div>
  )
}
