'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useBoundStore } from '@/store/smartlist/smartlist-bound'
import { useUserStore } from '@/store/user-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const newBoundSchema = z.object({
  type: z.enum(['family', 'diverse'], { required_error: 'Escolha um tipo!' }),
  family: z.array(z.string()).optional(),
  diverse: z.array(z.string()).optional(),
  description: z.string().nonempty('Preencha a descrição'),
  task: z.array(z.string().nonempty('Escolha uma tarefa!')),
  control: z.string().nonempty('Escolha um tipo de controle!'),
  automatic: z.enum(['ATIVADO', 'DESATIVADO']),
  periodic: z.string().optional(),
  timer: z.string().optional(),
})

type NewBoundData = z.infer<typeof newBoundSchema>

type SelectResponse = {
  id: number
  description: string
}

export function SheetNewBound() {
  const newBoundForm = useForm<NewBoundData>({
    resolver: zodResolver(newBoundSchema),
    defaultValues: {
      type: 'family',
      automatic: 'DESATIVADO',
    },
  })

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = newBoundForm

  const { user } = useUserStore()
  const { loadFamily, loadDiverse } = useBoundStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const filterText = searchParams.get('s') || ''

  const automatic = watch('automatic')
  const periodic = watch('periodic')

  async function handleCreateNewBound(data: NewBoundData) {
    try {
      const response = await api.post('/smart-list/bound', {
        ...data,
        control: Number(data.control),
        task: data.task.map(Number),
        familyId: data.family,
        diverseId: data.diverse,
        automatic: data.automatic === 'ATIVADO',
      })

      console.log(response.data)

      toast({
        title: 'Vínculo criado com sucesso!',
        variant: 'success',
      })

      reset({
        description: '',
        family: [],
        diverse: [],
        type: 'family',
        control: '',
        task: [],
        automatic: 'DESATIVADO',
      })
      queryClient.refetchQueries(['checklist/bounds', filterText])
    } catch (error) {
      console.log(error)
    }
  }

  const { data } = useQuery({
    queryKey: ['checklist/bounds/selects', user?.login],
    queryFn: async () => {
      const [family, diverse, task, control, periodicity] = await Promise.all([
        loadFamily(),
        loadDiverse(),
        api
          .get<{ task: SelectResponse[] }>('/smart-list/task')
          .then((res) => res.data.task),
        api
          .get<{ control: SelectResponse[] }>('/smart-list/bound/list-control')
          .then((res) => res.data.control),
        api
          .get<{
            data: { value: string; label: string }[]
          }>('system/choices/periodicity-bound')
          .then((res) => res.data.data),
      ])

      return {
        family: family?.map(({ id, family }) => ({
          label: family,
          value: id.toString(),
        })),
        diverse,
        task: task.map(({ id, description }) => ({
          label: description,
          value: id.toString(),
        })),
        control: control.map(({ id, description }) => ({
          label: description,
          value: id.toString(),
        })),
        periodicity,
      }
    },
    retry: true,
  })

  const type = watch('type')

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Novo vínculo
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-md">
        <SheetTitle>Criar novo vínculo e vincular tarefa</SheetTitle>
        <FormProvider {...newBoundForm}>
          <form
            className="mt-4 flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleCreateNewBound)}
          >
            <Form.Field>
              <Form.Label>Tipo:</Form.Label>
              <Form.Select
                name="type"
                options={[
                  { label: 'Família', value: 'family' },
                  { label: 'Diverso', value: 'diverse' },
                ]}
              />
            </Form.Field>

            {type === 'family' ? (
              <Form.Field>
                <Form.Label>Família:</Form.Label>
                <Form.MultiSelect name="family" options={data?.family || []} />
              </Form.Field>
            ) : (
              <Form.Field>
                <Form.Label>Diverso:</Form.Label>
                <Form.MultiSelect
                  name="diverse"
                  options={data?.diverse || []}
                />
              </Form.Field>
            )}

            <Form.Field>
              <Form.Label>Descrição:</Form.Label>
              <Form.Input name="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Tarefas:</Form.Label>
              <Form.MultiSelect name="task" options={data?.task || []} />
            </Form.Field>

            <Form.Field>
              <Form.Label>Controle:</Form.Label>
              <Form.Select name="control" options={data?.control || []} />
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

            <Button disabled={isSubmitting} loading={isSubmitting}>
              <Plus className="h-4 w-4" />
              Cadastrar vínculo
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
