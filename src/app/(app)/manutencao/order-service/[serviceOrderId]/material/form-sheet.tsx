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

const materialSchema = z.object({
  description: z.string({ required_error: 'Este campo e obrigatório!' }).min(1),
  quantity: z.coerce.number({ required_error: 'Este campo e obrigatório!' }),
  unitaryValue: z.string().optional(),
  dateUse: z.string({ required_error: 'Este campo e obrigatório!' }),
  serialNumberOld: z.string().optional(),
  serialNumberNewer: z.string().optional(),
  observation: z.string().optional(),
})

export type MaterialFormData = z.infer<typeof materialSchema>

interface FormSheetProps extends ComponentProps<typeof Sheet> {
  children?: ReactNode
  onSubmit: (data: MaterialFormData) => Promise<AxiosResponse>
  data?: MaterialFormData
}

export function FormSheet({
  children,
  onSubmit,
  data,
  ...props
}: FormSheetProps) {
  const materialForm = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
  })
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = materialForm

  async function handleSubmitMaterial(data: MaterialFormData) {
    const response = await onSubmit(data)

    if (response.status === 201)
      reset({
        dateUse: '',
        quantity: 0,
        unitaryValue: '',
        serialNumberNewer: '',
        serialNumberOld: '',
        observation: '',
      })
  }

  const { data: selects } = useQuery({
    queryKey: ['material-choice'],
    queryFn: async () => {
      const response = await api
        .get<{ data: SelectData[] }>('/system/choices/material')
        .then((res) => res.data)

      return { material: response.data }
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
        <FormProvider {...materialForm}>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleSubmitMaterial)}
          >
            {!selects?.material ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label required htmlFor="description">
                  Descrição:
                </Form.Label>
                <Form.Select
                  options={selects.material}
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
              <Form.Label htmlFor="unitaryValue">Valor unitário:</Form.Label>
              <Form.Input
                type="number"
                step="any"
                name="unitaryValue"
                id="unitaryValue"
              />
              <Form.ErrorMessage field="unitaryValue" />
            </Form.Field>

            <Form.Field>
              <Form.Label required htmlFor="dateUse">
                Data de uso:
              </Form.Label>
              <Form.Input type="date" step="any" name="dateUse" id="dateUse" />
              <Form.ErrorMessage field="dateUse" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="serialNumberOld">
                N° série antigo:
              </Form.Label>
              <Form.Input
                type="number"
                step="any"
                name="serialNumberOld"
                id="serialNumberOld"
              />
              <Form.ErrorMessage field="serialNumberOld" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="serialNumberNewer">
                N° série novo:
              </Form.Label>
              <Form.Input
                type="number"
                step="any"
                name="serialNumberNewer"
                id="serialNumberNewer"
              />
              <Form.ErrorMessage field="serialNumberNewer" />
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
