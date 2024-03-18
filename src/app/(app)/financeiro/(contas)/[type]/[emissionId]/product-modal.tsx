'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ComponentProps, Suspense } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface ProductModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
}

const schemaProduct = z.object({
  bound: z.enum(['equipment', 'stock', 'order'], {
    required_error: 'Este campo e obrigatório',
  }),
  itemBounded: z.array(z.coerce.number()).optional(),
  costCenter: z.coerce.string({ required_error: 'Este campo e obrigatório' }),
  item: z.string({ required_error: 'Este campo e obrigatório' }),
  unityValue: z.coerce.number({
    required_error: 'Este campo e obrigatório',
    invalid_type_error: 'Digite o valor correto',
  }),
  quantity: z.coerce.number({
    required_error: 'Este campo e obrigatório',
    invalid_type_error: 'Digite o valor correto',
  }),
})

export type ProductData = z.infer<typeof schemaProduct>

export function ProductModal({ mode, ...props }: ProductModalProps) {
  const createProductForm = useForm<ProductData>({
    resolver: zodResolver(schemaProduct),
  })
  const { handleSubmit, watch, reset } = createProductForm
  const routeParams = useParams()
  const { toast } = useToast()

  async function handleCreateProduct({
    bound,
    costCenter,
    quantity,
    item,
    unityValue,
    itemBounded,
  }: ProductData) {
    const boundUpper = (bound !== 'stock' ? 'bound' : bound).toUpperCase()
    const response = await api.post(
      `financial/account/finance/${routeParams.emissionId}/item`,
      {
        bound: boundUpper,
        [bound]: itemBounded,
        inputId: Number(item),
        compositionItemId: Number(costCenter),
        price: unityValue,
        quantity,
        application: `blank_financeiro_emissao_${routeParams.type}`,
      },
    )

    if (response.status !== 201) return

    toast({
      title: 'Item inserido com sucesso!',
      variant: 'success',
    })

    reset({
      bound: undefined,
      costCenter: undefined,
      item: undefined,
      itemBounded: undefined,
      quantity: undefined,
      unityValue: undefined,
    })
  }

  async function handleEditProduct(data: ProductData) {
    console.log(data)
  }

  const boundValue = watch('bound')
  const showItemBounded = boundValue === 'order' || boundValue === 'equipment'

  const { data } = useQuery({
    queryKey: ['financial/accounts/launch/selects'],
    queryFn: async () => {
      const params = {
        application: `blank_financeiro_emissao_${routeParams.type}`,
      }
      const [
        responseEquipment,
        responseOrder,
        responseMaterial,
        responseInput,
      ] = await Promise.all([
        api
          .get('financial/account/list-equipment', { params })
          .then((res) => res.data),
        api
          .get('financial/account/list-order', { params })
          .then((res) => res.data),
        api
          .get('financial/account/list-material', { params })
          .then((res) => res.data),
        api
          .get('financial/account/list-input', { params })
          .then((res) => res.data),
      ])

      return {
        equipment: responseEquipment.data,
        order: responseOrder.data,
        material: responseMaterial.data,
        inputTypes: responseInput.data,
      }
    },
  })

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...createProductForm}>
          <form
            onSubmit={handleSubmit(
              mode === 'create' ? handleCreateProduct : handleEditProduct,
            )}
            className="flex flex-col gap-3"
          >
            <Form.Field>
              <Form.Label htmlFor="bound-input">Vinculo:</Form.Label>
              <Form.Select
                name="bound"
                id="bound-input"
                options={[
                  { label: 'OS', value: 'order' },
                  { label: 'Equipamento', value: 'equipment' },
                  { label: 'Estoque', value: 'stock' },
                ]}
              />
              <Form.ErrorMessage field="bound" />
            </Form.Field>

            {showItemBounded && (
              <Suspense fallback={<Form.SkeletonField />}>
                <Form.Field>
                  <Form.Label htmlFor="item-bounded-input">
                    Item vinculado:
                  </Form.Label>
                  <Form.MultiSelect
                    name="itemBounded"
                    id="item-bounded-input"
                    options={
                      boundValue === 'equipment' ? data?.equipment : data?.order
                    }
                  />
                  <Form.ErrorMessage field="itemBounded" />
                </Form.Field>
              </Suspense>
            )}

            <Suspense fallback={<Form.SkeletonField />}>
              <Form.Field>
                <Form.Label htmlFor="item-input">Item:</Form.Label>
                <Form.Select
                  name="item"
                  id="item-input"
                  options={
                    routeParams.type === 'pagar'
                      ? data?.material
                      : data?.inputTypes
                  }
                />
                <Form.ErrorMessage field="item" />
              </Form.Field>
            </Suspense>
            <Form.Field>
              <Form.Label htmlFor="cost-center-input">
                Centro de custo:
              </Form.Label>
              <Form.CostCenterPicker name="costCenter" id="cost-center-input" />
              <Form.ErrorMessage field="costCenter" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="unity-value-input">
                Valor unitário:
              </Form.Label>
              <Form.Input
                name="unityValue"
                id="unity-value-input"
                type="number"
                step="any"
              />
              <Form.ErrorMessage field="unityValue" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="quantity-input">Quantidade:</Form.Label>
              <Form.Input
                name="quantity"
                id="quantity-input"
                type="number"
                step="any"
              />
              <Form.ErrorMessage field="quantity" />
            </Form.Field>

            <Button>
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
