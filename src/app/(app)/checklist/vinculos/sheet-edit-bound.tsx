'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { BoundData } from '@/store/smartlist/smartlist-bound'
import { useUserStore } from '@/store/user-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface SheetEditBoundProps extends ComponentProps<typeof Sheet> {
  defaultValues?: BoundData
}

const editBoundSchema = z.object({
  description: z.string().nonempty('Preencha a descrição'),
  // task: z.array(z.string().nonempty('Escolha uma tarefa!')),
  // control: z.string().nonempty('Escolha um tipo de controle!'),
  automatic: z.enum(['ATIVADO', 'DESATIVADO']).optional(),
  typePeriodicity: z.coerce.number().optional(),
  periodicityDate: z.string().optional(),
  periodicity: z.string().optional(),
  periodic: z.coerce.number().optional(),
  horaBase: z.string().optional(),
  dateBase: z.string().optional(),
})

type EditBoundData = z.infer<typeof editBoundSchema>

export function SheetEditBound({
  defaultValues,
  ...props
}: SheetEditBoundProps) {
  const newBoundForm = useForm<EditBoundData>({
    resolver: zodResolver(editBoundSchema),
  })
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
    setValue,
  } = newBoundForm

  const { user } = useUserStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const automatic = watch('automatic')
  const typePeriodic = watch('typePeriodicity')

  function convertMillisecondsToTime(milliseconds: number) {
    const totalMinutes = Math.floor(milliseconds / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const formattedHours = String(hours).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')
    return `${formattedHours}:${formattedMinutes}`
  }

  function convertTimeToSeconds(time: string) {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 3600 + minutes * 60
  }

  useEffect(() => {
    if (defaultValues) {
      setValue('description', defaultValues.description || '')
      setValue('automatic', defaultValues.automatic ? 'ATIVADO' : 'DESATIVADO')
      setValue(
        'typePeriodicity',
        defaultValues.typePeriodicity?.value || undefined,
      )
      setValue('periodicity', defaultValues.periodicity?.toString())

      const formattedDateBase = defaultValues.periodicDate
        ? new Date(defaultValues.periodicDate).toISOString().split('T')[0]
        : ''
      setValue('dateBase', formattedDateBase)

      const formattedTime = defaultValues.timer
        ? convertMillisecondsToTime(defaultValues.timer)
        : undefined
      setValue('horaBase', formattedTime || '')
    }
  }, [defaultValues, setValue])

  const { data } = useQuery({
    queryKey: ['checklist/bounds/selects', user?.login],
    queryFn: async () => {
      const [periodicity] = await Promise.all([
        api
          .get<{
            data: { value: string; label: string }[]
          }>('system/choices/periodicity-bound')
          .then((res) => res.data.data),
      ])
      return { periodicity }
    },
    retry: true,
  })

  async function handleEditNewBound(data: EditBoundData) {
    console.log('função foi chamada')

    const payload = {
      ...data,
      automatic: data.automatic === 'ATIVADO',
      periodicity: Number(data.periodicity),
      dateBase: data.dateBase
        ? new Date(data.dateBase).toISOString().split('T')[0]
        : undefined,
      horaBase: data.horaBase ? convertTimeToSeconds(data.horaBase) : undefined,
    }

    try {
      const response = await api
        .put(`/smart-list/bound/${defaultValues?.id}`, payload)
        .then((res) => res.data)

      if (response?.error) return

      toast({
        title: 'Vinculo atualizado com sucesso!',
        variant: 'success',
      })
      queryClient.refetchQueries(['checklist/bounds'])
    } catch (error) {
      console.error('Erro ao atualizar o vínculo:', error)
    }
  }

  return (
    <Sheet {...props}>
      <SheetContent className="max-w-md">
        <SheetTitle>Editar vinculo</SheetTitle>
        <FormProvider {...newBoundForm}>
          <form
            className="mt-4 flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleEditNewBound)}
          >
            <Form.Field>
              <Form.Label>Descrição:</Form.Label>
              <Form.Input name="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Lançamentos automáticos:</Form.Label>
              <Form.Select
                name="automatic"
                options={[
                  { label: 'ATIVADO', value: 'ATIVADO' },
                  { label: 'DESATIVADO', value: 'DESATIVADO' },
                ]}
              />
            </Form.Field>

            {automatic === 'ATIVADO' && (
              <Form.Field>
                <Form.Label>Periodicidade:</Form.Label>
                <Form.Select
                  name="typePeriodicity"
                  options={data?.periodicity || []}
                />
                <Form.ErrorMessage field="typePeriodicity" />
              </Form.Field>
            )}

            {automatic === 'ATIVADO' && typePeriodic?.toString() === '1' && (
              <Form.Field>
                <Form.Label>Intervalo em horas:</Form.Label>
                <Form.Input
                  name="periodicity"
                  type="number"
                  placeholder="Informe o intervalo em horas"
                />
                <Form.ErrorMessage field="periodicity" />
              </Form.Field>
            )}

            {automatic === 'ATIVADO' && typePeriodic?.toString() === '2' && (
              <>
                <Form.Field>
                  <Form.Label>Horário:</Form.Label>
                  <Form.Input
                    name="horaBase"
                    type="time"
                    placeholder="Informe o horário"
                  />
                  <Form.ErrorMessage field="horaBase" />
                </Form.Field>
              </>
            )}

            {automatic === 'ATIVADO' && typePeriodic?.toString() === '3' && (
              <>
                <Form.Field>
                  <Form.Label>Dia da semana:</Form.Label>
                  <Form.Select
                    name="periodicity"
                    options={[
                      { label: 'Segunda-feira', value: '1' },
                      { label: 'Terça-feira', value: '2' },
                      { label: 'Quarta-feira', value: '3' },
                      { label: 'Quinta-feira', value: '4' },
                      { label: 'Sexta-feira', value: '5' },
                      { label: 'Sábado', value: '6' },
                      { label: 'Domingo', value: '7' },
                    ]}
                  />
                  <Form.ErrorMessage field="periodicity" />
                </Form.Field>
                <Form.Field>
                  <Form.Label>Horário:</Form.Label>
                  <Form.Input
                    name="horaBase"
                    type="time"
                    placeholder="Informe o horário"
                  />
                  <Form.ErrorMessage field="horaBase" />
                </Form.Field>
              </>
            )}

            {automatic === 'ATIVADO' && typePeriodic?.toString() === '4' && (
              <>
                <Form.Field>
                  <Form.Label>Data inicial do lançamento:</Form.Label>
                  <Form.Input name="dateBase" type="date" />
                </Form.Field>
                <Form.Field>
                  <Form.Label>Horário:</Form.Label>
                  <Form.Input
                    name="horaBase"
                    type="time"
                    placeholder="Informe o horário"
                  />
                  <Form.ErrorMessage field="horaBase" />
                </Form.Field>
              </>
            )}

            <Button disabled={isSubmitting} loading={isSubmitting}>
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
