'use client'

import { EmissionProduct } from '@/@types/finance-emission'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useEmissionStore } from '@/store/financial/emission'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ComponentProps, Suspense, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface ProductModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
}

const schemaProduct = z.object({
  bound: z.enum(['EQUIPMENT', 'STOCK', 'OS'], {
    required_error: 'Este campo e obrigatório',
  }),
  itemBounded: z.array(z.coerce.string()).optional(),
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

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting },
  } = createProductForm
  const { editData, totalProducts, setTotalProducts } = useEmissionStore(
    ({ editData, totalProducts, setTotalProducts }) => ({
      editData,
      totalProducts,
      setTotalProducts,
    }),
  )
  const routeParams = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleCreateProduct({
    bound,
    costCenter,
    quantity,
    item,
    unityValue,
    itemBounded,
  }: ProductData) {
    const response = await api.post(
      `financial/account/finance/${routeParams.emissionId}/item`,
      {
        bound,
        [bound === 'OS' ? 'order' : bound.toLowerCase()]: itemBounded,
        inputId: Number(item),
        compositionItemId: Number(costCenter),
        price: unityValue,
        quantity,
        application: `blank_financeiro_emissao_${routeParams.type}`,
      },
    )

    if (response.status !== 201) return

    const data =
      (await queryClient.getQueryData<EmissionProduct[]>([
        `financial/account/launch/${routeParams.type}/${routeParams.emissionId}`,
      ])) || []

    const updatedData = [...data, response.data.item]

    queryClient.setQueryData(
      [
        `financial/account/launch/${routeParams.type}/${routeParams.emissionId}`,
      ],
      updatedData,
    )

    toast({
      title: 'Item inserido com sucesso!',
      variant: 'success',
    })

    setTotalProducts(unityValue * quantity + totalProducts)

    reset({
      bound: undefined,
      costCenter: undefined,
      item: undefined,
      itemBounded: undefined,
      quantity: 0,
      unityValue: 0,
    })
  }

  async function handleEditProduct({
    bound,
    itemBounded,
    item,
    costCenter,
    unityValue,
    quantity,
  }: ProductData) {
    const updatedProduct = {
      bound,
      [bound === 'OS' ? 'order' : bound.toLowerCase()]: itemBounded,
      inputId: Number(item),
      compositionItemId: Number(costCenter),
      price: unityValue,
      quantity,
    }
    const response = await api.put(
      `financial/account/finance/${routeParams.emissionId}/item/${editData?.id}`,
      {
        ...updatedProduct,
        application: `blank_financeiro_emissao_${routeParams.type}`,
      },
    )

    if (response.status !== 200) return

    const data =
      (await queryClient.getQueryData<EmissionProduct[]>([
        `financial/account/launch/${routeParams.type}/${routeParams.emissionId}`,
      ])) || []

    const updatedData = data.map((item) => {
      if (item.id === editData?.id) {
        const currentTotal = unityValue * quantity
        const total = Number(item.total) - totalProducts
        setTotalProducts(total + currentTotal)

        return response.data.item
      }

      return item
    })

    queryClient.setQueryData(
      [
        `financial/account/launch/${routeParams.type}/${routeParams.emissionId}`,
      ],
      updatedData,
    )

    toast({
      title: 'Produto atualizado com sucesso!',
      variant: 'success',
    })
  }

  const boundValue = watch('bound')
  const showItemBounded = boundValue === 'OS' || boundValue === 'EQUIPMENT'

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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!editData?.bound) {
      reset({
        bound: undefined,
        costCenter: undefined,
        item: undefined,
        itemBounded: undefined,
        quantity: 0,
        unityValue: 0,
      })
      return
    }
    const bound = editData?.bound
    setValue('bound', bound)

    if (editData.bound !== 'STOCK') {
      const boundKey =
        editData.bound.toLowerCase() !== 'equipment' ? 'order' : 'equipment'
      setValue(
        'itemBounded',
        editData[boundKey].map(({ value }) => value.toString()),
      )
    }

    const currentItemKey = routeParams.type === 'pagar' ? 'material' : 'input'

    setValue('item', editData[currentItemKey]?.value.toString() || '')
    setValue('costCenter', editData.compositionItem.value)
    setValue('unityValue', Number(editData.price))
    setValue('quantity', Number(editData.quantity))
  }, [mode, editData, props.open])

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
                  { label: 'OS', value: 'OS' },
                  { label: 'Equipamento', value: 'EQUIPMENT' },
                  { label: 'Estoque', value: 'STOCK' },
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
                      boundValue === 'EQUIPMENT' ? data?.equipment : data?.order
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
              <Form.CostCenterPicker
                name="costCenter"
                id="cost-center-input"
                defaultLabel={editData?.compositionItem.label}
              />
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

            <Button loading={isSubmitting} disabled={isSubmitting}>
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
