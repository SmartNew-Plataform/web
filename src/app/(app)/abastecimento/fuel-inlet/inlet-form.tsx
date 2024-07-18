'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const inletFormSchema = z.object({
  compartmentid: z.string({ required_error: 'Informe o compartimento' }),
  quantity: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
  value: z.number({ required_error: 'Este campo é obrigatório!' }),
})

export type InletFormData = z.infer<typeof inletFormSchema>

interface ModalInletFormProps extends ComponentProps<typeof Dialog> {
  onSubmit: (data: InletFormData) => void
  defaultValues?: InletFormData
  mode?: 'create' | 'edit'
  tankId?: string
  compartmentOptions?: { label: string; value: string }[] | undefined
}

export function ModalInletForm({
  onSubmit,
  mode = 'create',
  defaultValues,
  tankId,
  compartmentOptions,
  ...props
}: ModalInletFormProps) {
  const InletDiverseForm = useForm<InletFormData>({
    resolver: zodResolver(inletFormSchema),
  })
  const { handleSubmit, reset } = InletDiverseForm

  async function intermadeSubmit(data: InletFormData) {
    await onSubmit(data)
    if (mode === 'create') reset({ compartmentid: '' })
  }

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset, tankId])

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...InletDiverseForm}>
          <form
            onSubmit={handleSubmit(intermadeSubmit)}
            className="flex w-full flex-col gap-2"
          >
            <Form.Field>
              <Form.Label htmlFor="compartment">Compartimento:</Form.Label>
              <Form.Select name="compartmentid" id="compartmentid">
                {compartmentOptions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
              <Form.ErrorMessage field="compartmentid" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="quantity">Quantidade:</Form.Label>
              <Form.Input type="number" name="quantity" id="quantity" />
              <Form.ErrorMessage field="quantity" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="value">Valor:</Form.Label>
              <Form.Input type="number" name="value" id="value" />
              <Form.ErrorMessage field="value" />
            </Form.Field>
            <Button type="submit">
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
