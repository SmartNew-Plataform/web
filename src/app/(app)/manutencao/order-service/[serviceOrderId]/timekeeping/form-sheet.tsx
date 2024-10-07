'use client'

import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import { Save } from 'lucide-react'
import { ComponentProps, ReactNode, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const timeKeepingSchema = z.object({
  collaborator: z.string().min(1, 'Este campo e obrigatório!'),
  description: z.string().min(1, 'Este campo e obrigatório!'),
  date: z.string().min(1, 'Este campo e obrigatório!'),
  start: z.string().optional(),
  end: z.string().optional(),
  realTime: z.string().min(1, 'Este campo e obrigatório!'),
  status: z.string().min(1, 'Este campo e obrigatório!'),
})

export type TimeKeepingFormData = z.infer<typeof timeKeepingSchema>

interface FormSheetProps extends ComponentProps<typeof Sheet> {
  children?: ReactNode
  onSubmit: (data: TimeKeepingFormData) => Promise<AxiosResponse>
  data?: TimeKeepingFormData
}

export function FormSheet({
  children,
  onSubmit,
  data,
  ...props
}: FormSheetProps) {
  const timeKeepingForm = useForm<TimeKeepingFormData>({
    resolver: zodResolver(timeKeepingSchema),
  })
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
    reset,
  } = timeKeepingForm

  async function handleSubmitTimeKeeping(data: TimeKeepingFormData) {
    const response = await onSubmit(data)

    if (response.status === 201)
      reset({
        description: '',
        date: '',
        start: '',
        end: '',
        realTime: '',
      })
  }

  const start = watch('start')
  const end = watch('end')

  useEffect(() => {
    if (!data) return
    reset(data)
  }, [data])

  useEffect(() => {
    if (!start || !end) return

    const startList = start?.split(':').map(Number)
    const endList = end?.split(':').map(Number)

    const startHour = dayjs().hour(startList[0]).minute(startList[1])
    const endHour = dayjs().hour(endList[0]).minute(endList[1])

    const diffHours = endHour.diff(startHour, 'hours', true)
    const realTime = dayjs()
      .set('hour', 0)
      .set('minute', 0)
      .add(diffHours, 'hours')
      .format('HH:mm')

    console.log(realTime)

    setValue('realTime', realTime)
  }, [start, end])

  const { data: selects } = useQuery({
    queryKey: ['timekeeping-selects'],
    queryFn: async () => {
      const [employee, status] = await Promise.all([
        api
          .get<{ data: SelectData[] }>('/system/choices/employee')
          .then((res) => res.data.data),
        api
          .get<{ data: SelectData[] }>('/system/choices/status-service-order')
          .then((res) => res.data.data),
      ])

      return { employee, status }
    },
  })

  return (
    <Sheet {...props}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent>
        <FormProvider {...timeKeepingForm}>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleSubmitTimeKeeping)}
          >
            {!selects?.employee ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label required htmlFor="collaborator">
                  Colaboradores:
                </Form.Label>
                <Form.Select
                  name="collaborator"
                  id="collaborator"
                  options={selects.employee}
                />
                <Form.ErrorMessage field="collaborator" />
              </Form.Field>
            )}

            <Form.Field>
              <Form.Label required htmlFor="description">
                Descrição:
              </Form.Label>
              <Form.Textarea name="description" id="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label required htmlFor="date">
                Data:
              </Form.Label>
              <Form.Input type="date" name="date" id="date" />
              <Form.ErrorMessage field="date" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="start">Inicio:</Form.Label>
              <Form.Input type="time" name="start" id="start" />
              <Form.ErrorMessage field="start" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="end">Termino:</Form.Label>
              <Form.Input type="time" name="end" id="end" />
              <Form.ErrorMessage field="end" />
            </Form.Field>

            <Form.Field>
              <Form.Label required htmlFor="realTime">
                Tempo real:
              </Form.Label>
              <Form.Input type="text" readOnly name="realTime" id="realTime" />
              <Form.ErrorMessage field="realTime" />
            </Form.Field>

            {!selects?.status ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label required htmlFor="status">
                  Status da O.S.:
                </Form.Label>
                <Form.Select
                  options={selects.status}
                  name="status"
                  id="status"
                />
                <Form.ErrorMessage field="status" />
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
