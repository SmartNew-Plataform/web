'use client'

import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Save } from 'lucide-react'
import { ComponentProps, ReactNode, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const diverseSchema = z.object({
  description: z.string({ required_error: 'Este campo e obrigatório!' }).min(1),
  quantity: z.coerce.number({ required_error: 'Este campo e obrigatório!' }),
  unitaryValue: z.coerce.number({
    required_error: 'Este campo e obrigatório!',
  }),
  date: z.string({ required_error: 'Este campo e obrigatório!' }),
  observation: z.string().optional(),
})

export type DiverseFormData = z.infer<typeof diverseSchema>

interface FormSheetProps extends ComponentProps<typeof Sheet> {
  children?: ReactNode
  onSubmit: (data: DiverseFormData) => Promise<AxiosResponse>
  data?: DiverseFormData
}

export function FormSheet({
  children,
  onSubmit,
  data,
  ...props
}: FormSheetProps) {
  const diverseForm = useForm<DiverseFormData>({
    resolver: zodResolver(diverseSchema),
  })
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = diverseForm

  async function handleSubmitDiverse(data: DiverseFormData) {
    const response = await onSubmit(data)

    if (response.status === 201)
      reset({
        date: '',
        quantity: 0,
        unitaryValue: 0,
        description: '',
        observation: '',
      })
  }

  const { data: selects } = useQuery({
    queryKey: ['cost-choice'],
    queryFn: async () => {
      const response = await api
        .get<{ data: SelectData[] }>('/system/choices/cost-service-order')
        .then((res) => res.data)

      return { cost: response.data }
    },
  })

  useEffect(() => {
    if (!data) return
    reset(data)
  }, [data])

  return (
    <Sheet {...props}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent>
        <FormProvider {...diverseForm}>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleSubmitDiverse)}
          >
            {!selects?.cost ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label required htmlFor="description">
                  Descrição:
                </Form.Label>
                <Form.Select
                  options={selects.cost}
                  name="description"
                  id="description"
                />
                <Form.ErrorMessage field="description" />
              </Form.Field>
            )}

            <Form.Field>
              <Form.Label required htmlFor="quantity">
                Quantidade:
              </Form.Label>
              <Form.Input
                type="number"
                step="any"
                name="quantity"
                id="quantity"
              />
              <Form.ErrorMessage field="quantity" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="unitaryValue" required>
                Custo unitário:
              </Form.Label>
              <Form.Input
                type="number"
                step="any"
                name="unitaryValue"
                id="unitaryValue"
              />
              <Form.ErrorMessage field="unitaryValue" />
            </Form.Field>

            <Form.Field>
              <Form.Label required htmlFor="date">
                Data:
              </Form.Label>
              <Form.Input type="date" step="any" name="date" id="date" />
              <Form.ErrorMessage field="date" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="observation">Observação:</Form.Label>
              <Form.Textarea name="observation" id="observation" />
              <Form.ErrorMessage field="observation" />
            </Form.Field>

            <Button disabled={isSubmitting} loading={isSubmitting}>
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
