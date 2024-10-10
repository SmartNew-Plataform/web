'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useUserStore } from '@/store/user-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { BoundData } from './table-bounds'

interface SheetEditBoundProps extends ComponentProps<typeof Sheet> {
  defaultValues?: BoundData
}

const editBoundSchema = z.object({
  description: z
    .string({ required_error: 'A descrição e obrigatória!' })
    .nonempty({ message: 'Preencha a descrição' }),
  automatic: z.enum(['ATIVADO', 'DESATIVADO']),
  periodicDate: z.string().optional(),
  periodic: z.string().optional(),
  interval: z.number().optional(),
  timer: z.string().optional(),

  // task: z.array(
  //   z.string({
  //     required_error: 'Escolha uma tarefa!',
  //     invalid_type_error: 'Você não selecionou nada!',
  //   }),
  // ),
  // control: z.string({
  //   required_error: 'Escolha um tipo de controle!',
  //   invalid_type_error: 'Você não selecionou nada!',
  // }),
})

type EditBoundData = z.infer<typeof editBoundSchema>

// type SelectResponse = {
//   id: number
//   description: string
// }

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
  const periodic = watch('periodic')

  useEffect(() => {
    setValue('description', defaultValues?.description || '')
    setValue('automatic', defaultValues?.automatic ? 'ATIVADO' : 'DESATIVADO')
    setValue('periodic', defaultValues?.periodic)
    setValue('periodicDate', defaultValues?.periodicDate)
    setValue('interval', defaultValues?.interval)
    setValue('timer', defaultValues?.timer)
    // setValue('task', defaultValues.|| '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues])

  console.log(defaultValues)

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

      return {
        periodicity,
      }
    },
    retry: true,
  })

  async function handleEditNewBound(data: EditBoundData) {
    const response = await api
      .put(`/smart-list/bound/${defaultValues?.id}`, data)
      .then((res) => res.data)

    if (response?.error) return

    toast({
      title: 'Vinculo atualizado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['checklist/bounds'])
  }

  // const { data } = useQuery({
  //   queryKey: ['checklist/bounds/selects'],
  //   queryFn: async () => {
  //     const [task, control] = await Promise.all([
  //       api
  //         .get<{ task: SelectResponse[] }>('/smart-list/task')
  //         .then((res) => res.data.task),
  //       api
  //         .get<{ control: SelectResponse[] }>('/smart-list/bound/list-control')
  //         .then((res) => res.data.control),
  //     ])

  //     return {
  //       task: task.map(({ id, description }) => ({
  //         label: description,
  //         value: id.toString(),
  //       })),
  //       control: control.map(({ id, description }) => ({
  //         label: description,
  //         value: id.toString(),
  //       })),
  //     }
  //   },
  //   retry: true,
  // })

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
                  name="periodic"
                  options={data?.periodicity || []}
                />
              </Form.Field>
            )}

            {automatic === 'ATIVADO' && periodic === '1' && (
              <Form.Field>
                <Form.Label>Intervalo em horas:</Form.Label>
                <Form.Input
                  name="timer"
                  type="number"
                  placeholder="Informe o intervalo em horas"
                />
              </Form.Field>
            )}

            {automatic === 'ATIVADO' && periodic === '2' && (
              <>
                <Form.Field>
                  <Form.Label>Dia da semana:</Form.Label>
                  <Form.Select
                    name="timer"
                    options={[
                      { label: 'Segunda-feira', value: 'MONDAY' },
                      { label: 'Terça-feira', value: 'TUESDAY' },
                      { label: 'Quarta-feira', value: 'WEDNESDAY' },
                      { label: 'Quinta-feira', value: 'THURSDAY' },
                      { label: 'Sexta-feira', value: 'FRIDAY' },
                      { label: 'Sábado', value: 'SATURDAY' },
                      { label: 'Domingo', value: 'SUNDAY' },
                    ]}
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Label>Horário:</Form.Label>
                  <Form.Input
                    name="time"
                    type="time"
                    placeholder="Informe o horário"
                  />
                </Form.Field>
              </>
            )}

            {automatic === 'ATIVADO' && periodic === '3' && (
              <>
                <Form.Field>
                  <Form.Label>Data inicial do lançamento:</Form.Label>
                  <Form.Input name="timer" type="date" />
                </Form.Field>
                <Form.Field>
                  <Form.Label>Horário:</Form.Label>
                  <Form.Input
                    name="time"
                    type="time"
                    placeholder="Informe o horário"
                  />
                </Form.Field>
              </>
            )}

            {automatic === 'ATIVADO' && periodic === '4' && (
              <>
                <Form.Field>
                  <Form.Label>Data inicial do lançamento:</Form.Label>
                  <Form.Input name="timer" type="date" />
                </Form.Field>
                <Form.Field>
                  <Form.Label>Horário:</Form.Label>
                  <Form.Input
                    name="time"
                    type="time"
                    placeholder="Informe o horário"
                  />
                </Form.Field>
              </>
            )}

            {/* <Form.Field>
              <Form.Label>Tarefas:</Form.Label>
              <Form.MultiSelect name="task" options={data?.task || []} />
            </Form.Field>

            <Form.Field>
              <Form.Label>Controle:</Form.Label>
              <Form.Select name="control" options={data?.control || []} />
            </Form.Field> */}

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
