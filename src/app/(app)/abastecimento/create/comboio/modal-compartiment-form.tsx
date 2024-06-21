'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const compartmentFormSchema = z.object({
  fuel: z
    .string({ required_error: 'Este campo é obrigatório!' })
    .min(1, 'Este campo e obrigatório'),
  capacity: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
})

export type CompartmentFormData = z.infer<typeof compartmentFormSchema>

interface ModalCompartmentFormProps extends ComponentProps<typeof Dialog> {
  onSubmit: (data: CompartmentFormData) => void
  defaultValues?: CompartmentFormData
  mode?: 'create' | 'edit'
  tankId?: string
}

export function ModalCompartmentForm({
  onSubmit,
  mode = 'create',
  defaultValues,
  ...props
}: ModalCompartmentFormProps) {
  const CompartmentDiverseForm = useForm<CompartmentFormData>({
    resolver: zodResolver(compartmentFormSchema),
  })
  const { handleSubmit, reset } = CompartmentDiverseForm

  async function intermadeSubmit(data: CompartmentFormData) {
    await onSubmit(data)
    if (mode === 'create') reset({ fuel: '' })
  }

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  async function fetchSelects() {
    const response = await api
      .get(`fuelling/list-fuel`)
      .then((res) => res.data.data)

    return {
      fuel: response,
    }
  }

  const { data } = useQuery({
    queryKey: ['fuelling/tank/fuel/selects'],
    queryFn: fetchSelects,
  })

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...CompartmentDiverseForm}>
          <form
            onSubmit={handleSubmit(intermadeSubmit)}
            className="flex w-full flex-col gap-2"
          >
            <Form.Field>
              <Form.Label htmlFor="fuel-input">Combustível:</Form.Label>
              <Form.Select
                name="fuel"
                id="fuel-input"
                options={data?.fuel || []}
              />
              <Form.ErrorMessage field="fuel" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="capacity-input">Capacidade:</Form.Label>
              <Form.Input type="number" name="capacity" id="capacity-input" />
              <Form.ErrorMessage field="capacity" />
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
