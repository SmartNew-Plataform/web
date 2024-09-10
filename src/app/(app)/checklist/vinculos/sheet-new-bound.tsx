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
import { validateMultipleOptions } from '@/lib/validate-multiple-options'
import { useBoundStore } from '@/store/smartlist/smartlist-bound'
import { useTasksBoundedStore } from '@/store/smartlist/smartlist-tasks-bounded'
import { useUserStore } from '@/store/user-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const newBoundSchema = z
  .object({
    type: z.enum(['family', 'diverse'], { required_error: 'Escolha um tipo!' }),
    family: z
      .array(
        z.string({
          invalid_type_error: 'Selecione uma familia!',
        }),
      )
      .optional(),
    diverse: z
      .array(
        z.string({
          required_error: 'A família é obrigatória!',
        }),
      )
      .optional(),
    description: z
      .string({ required_error: 'A descrição é obrigatória!' })
      .nonempty({ message: 'Preencha a descrição' }),
  })
  .superRefine((data, ctx) =>
    validateMultipleOptions<typeof data>(data, ctx, data.type),
  )

const newTaskSchema = z.object({
  task: z.array(
    z.string({
      required_error: 'Escolha uma tarefa!',
      invalid_type_error: 'Você não selecionou nada!',
    }),
  ),
  control: z.string({
    required_error: 'Escolha um tipo de controle!',
    invalid_type_error: 'Você não selecionou nada!',
  }),
})

type NewBoundData = z.infer<typeof newBoundSchema>
type NewTaskData = z.infer<typeof newTaskSchema>

export function SheetNewBound() {
  const [boundId, setBoundId] = useState<string | null>(null) // Armazena o ID do vínculo criado
  const newBoundForm = useForm<NewBoundData>({
    resolver: zodResolver(newBoundSchema),
    defaultValues: {
      type: 'family',
    },
  })

  const newTaskForm = useForm<NewTaskData>({
    resolver: zodResolver(newTaskSchema),
  })

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = newBoundForm

  const { handleSubmit: handleSubmitTask, reset: resetTask } = newTaskForm

  const { user } = useUserStore()
  const { loadFamily, loadDiverse } = useBoundStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const filterText = searchParams.get('s') || ''

  // Criação do vínculo
  async function handleCreateNewBound(data: NewBoundData) {
    try {
      const response = await api.post('/smart-list/bound', {
        ...data,
        familyId: data.family,
        diverseId: data.diverse,
      })
      console.log(response.data)
      // const createdBoundId = response.data.id
      setBoundId('200')

      toast({
        title: 'Vínculo criado com sucesso!',
        variant: 'success',
      })

      reset({ description: '', family: [], diverse: [], type: 'family' })
      queryClient.refetchQueries(['checklist/bounds', filterText])
    } catch (error) {
      console.log(error)
    }
  }

  async function handleNewTask(data: NewTaskData) {
    if (!boundId) return

    try {
      await api.post(`/smart-list/bound/${boundId}/item`, {
        controlId: Number(data.control),
        task: data.task,
        filterText,
      })

      toast({
        title: 'Tarefa vinculada com sucesso!',
        variant: 'success',
      })

      resetTask({ control: '', task: [] })
      queryClient.refetchQueries(['checklist/bound/task', boundId])
    } catch (error) {
      console.error(error)
    }
  }

  const { data } = useQuery({
    queryKey: ['checklist/bounds/selects', user?.login],
    queryFn: async () => {
      const [family, diverse] = await Promise.all([loadFamily(), loadDiverse()])

      return {
        family: family?.map(({ id, family }) => ({
          label: family,
          value: id.toString(),
        })),
        diverse,
      }
    },
    retry: true,
  })

  const { task, control } = useTasksBoundedStore(
    ({ task, loadTasksBounded, control }) => {
      const taskFormatted = task
        ? task.map(({ id, description }) => ({
            label: description,
            value: id.toString(),
          }))
        : []

      const controlFormatted = control
        ? control.map(({ id, description }) => ({
            label: description,
            value: id.toString(),
          }))
        : []

      return {
        task: taskFormatted,
        loadTasksBounded,
        control: controlFormatted,
      }
    },
  )

  console.log('Bound ID:', boundId)

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

            <Button disabled={isSubmitting} loading={isSubmitting}>
              <Plus className="h-4 w-4" />
              Cadastrar vínculo
            </Button>
          </form>
        </FormProvider>
        {/* Exibe o formulário de vinculação de tarefa após criar o vínculo */}
        {boundId && (
          <FormProvider {...newTaskForm}>
            <form
              className="mt-6 flex w-full flex-col gap-3"
              onSubmit={handleSubmitTask(handleNewTask)}
            >
              <Form.Field>
                <Form.Label>Tarefas:</Form.Label>
                <Form.MultiSelect name="task" options={task} />
              </Form.Field>

              <Form.Field>
                <Form.Label>Controle:</Form.Label>
                <Form.Select name="control" options={control} />
              </Form.Field>

              <Button disabled={isSubmitting} loading={isSubmitting}>
                <Plus className="h-4 w-4" />
                Vincular tarefa
              </Button>
            </form>
          </FormProvider>
        )}
      </SheetContent>
    </Sheet>
  )
}
