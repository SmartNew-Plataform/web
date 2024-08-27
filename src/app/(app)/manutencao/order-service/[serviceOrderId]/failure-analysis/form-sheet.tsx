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

const failureAnalysisSchema = z.object({
  component: z.string({ required_error: 'Este campo e obrigatório!' }),
  symptom: z.string({ required_error: 'Este campo e obrigatório!' }),
  cause: z.string({ required_error: 'Este campo e obrigatório!' }),
  action: z.string({ required_error: 'Este campo e obrigatório!' }),
})

export type FailureAnalysisFormData = z.infer<typeof failureAnalysisSchema>

interface FormSheetProps extends ComponentProps<typeof Sheet> {
  children?: ReactNode
  onSubmit: (data: FailureAnalysisFormData) => Promise<AxiosResponse>
  data?: FailureAnalysisFormData
}

export function FormSheet({
  children,
  onSubmit,
  data,
  ...props
}: FormSheetProps) {
  const failureAnalysisForm = useForm<FailureAnalysisFormData>({
    resolver: zodResolver(failureAnalysisSchema),
  })
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = failureAnalysisForm

  async function handleSubmitFailureAnalysis(data: FailureAnalysisFormData) {
    const response = await onSubmit(data)

    if (response.status === 201) reset()
  }

  const { data: selects } = useQuery({
    queryKey: ['selects-choice'],
    queryFn: async () => {
      const [component, symptom, cause, action] = await Promise.all([
        api
          .get<{ data: SelectData[] }>('/system/choices/components')
          .then((res) => res.data.data),
        api
          .get<{ data: SelectData[] }>('/system/choices/failure-symptoms')
          .then((res) => res.data.data),
        api
          .get<{ data: SelectData[] }>('/system/choices/failure-cause')
          .then((res) => res.data.data),
        api
          .get<{ data: SelectData[] }>('/system/choices/failure-action')
          .then((res) => res.data.data),
      ])

      return { component, symptom, cause, action }
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
        <FormProvider {...failureAnalysisForm}>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleSubmitFailureAnalysis)}
          >
            {!selects?.component ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label required htmlFor="component">
                  Componente:
                </Form.Label>
                <Form.Select
                  options={selects.component}
                  name="component"
                  id="component"
                />
                <Form.ErrorMessage field="component" />
              </Form.Field>
            )}

            {!selects?.symptom ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label required htmlFor="symptom">
                  Sintoma:
                </Form.Label>
                <Form.Select
                  options={selects.symptom}
                  name="symptom"
                  id="symptom"
                />
                <Form.ErrorMessage field="symptom" />
              </Form.Field>
            )}

            {!selects?.cause ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label required htmlFor="cause">
                  Causa:
                </Form.Label>
                <Form.Select options={selects.cause} name="cause" id="cause" />
                <Form.ErrorMessage field="cause" />
              </Form.Field>
            )}

            {!selects?.action ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label required htmlFor="action">
                  Ação:
                </Form.Label>
                <Form.Select
                  options={selects.action}
                  name="action"
                  id="action"
                />
                <Form.ErrorMessage field="action" />
              </Form.Field>
            )}

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
