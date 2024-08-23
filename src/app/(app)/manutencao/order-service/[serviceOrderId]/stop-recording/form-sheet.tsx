'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosResponse } from 'axios'
import { Save } from 'lucide-react'
import { ComponentProps, ReactNode, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const stopRecordingSchema = z.object({
  dateStop: z.string({ required_error: 'Este campo e obrigatório!' }).min(1),
  dateWorked: z.string({ required_error: 'Este campo e obrigatório!' }).min(1),
  observation: z.string().optional(),
})

export type StopRecordingFormData = z.infer<typeof stopRecordingSchema>

interface FormSheetProps extends ComponentProps<typeof Sheet> {
  children?: ReactNode
  onSubmit: (data: StopRecordingFormData) => Promise<AxiosResponse>
  data?: StopRecordingFormData
}

export function FormSheet({
  children,
  onSubmit,
  data,
  ...props
}: FormSheetProps) {
  const stopRecordingForm = useForm<StopRecordingFormData>({
    resolver: zodResolver(stopRecordingSchema),
  })
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = stopRecordingForm

  async function handleSubmitStopRecording(data: StopRecordingFormData) {
    const response = await onSubmit(data)

    if (response.status === 201)
      reset({ dateStop: '', dateWorked: '', observation: '' })
  }

  useEffect(() => {
    if (!data) return
    reset(data)
  }, [data])

  return (
    <Sheet {...props}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent>
        <FormProvider {...stopRecordingForm}>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleSubmitStopRecording)}
          >
            <Form.Field>
              <Form.Label required htmlFor="dateStop">
                Data que parou:
              </Form.Label>
              <Form.Input type="datetime-local" name="dateStop" id="dateStop" />
              <Form.ErrorMessage field="dateStop" />
            </Form.Field>

            <Form.Field>
              <Form.Label required htmlFor="dateWorked">
                Data que funcionou:
              </Form.Label>
              <Form.Input
                type="datetime-local"
                name="dateWorked"
                id="dateWorked"
              />
              <Form.ErrorMessage field="dateWorked" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="observation">Observação:</Form.Label>
              <Form.Textarea name="observation" id="observation" />
              <Form.ErrorMessage field="observation" />
            </Form.Field>

            <Button loading={isSubmitting} disabled={isSubmitting}>
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
