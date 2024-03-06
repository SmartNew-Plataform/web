'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

type CreateProductModalProps = object & ComponentProps<typeof Dialog>

const schemaCreateProduct = z.object({
  bound: z.string({ required_error: 'Este campo e obrigatório' }),
  itemBounded: z.string().optional(),
  costCenter: z.string({ required_error: 'Este campo e obrigatório' }),
  unityValue: z.coerce.number({
    required_error: 'Este campo e obrigatório',
    invalid_type_error: 'Digite o valor correto',
  }),
  quantity: z.coerce.number({
    required_error: 'Este campo e obrigatório',
    invalid_type_error: 'Digite o valor correto',
  }),
})

type CreateProductData = z.infer<typeof schemaCreateProduct>

export function CreateProductModal({ ...props }: CreateProductModalProps) {
  const createProductForm = useForm<CreateProductData>({
    resolver: zodResolver(schemaCreateProduct),
  })
  const { handleSubmit, watch } = createProductForm

  async function handleCreateProduct(data: CreateProductData) {
    console.log(data)
  }

  const boundValue = watch('bound')
  const showItemBounded = boundValue === 'order' || boundValue === 'equipment'

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...createProductForm}>
          <form
            onSubmit={handleSubmit(handleCreateProduct)}
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
              <Form.Field>
                <Form.Label htmlFor="item-bounded-input">
                  Item vinculado:
                </Form.Label>
                <Form.Select
                  name="itemBounded"
                  id="item-bounded-input"
                  options={[]}
                />
                <Form.ErrorMessage field="itemBounded" />
              </Form.Field>
            )}
            <Form.Field>
              <Form.Label htmlFor="item-input">Item:</Form.Label>
              <Form.Select name="item" id="item-input" options={[]} />
              <Form.ErrorMessage field="item" />
            </Form.Field>
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
