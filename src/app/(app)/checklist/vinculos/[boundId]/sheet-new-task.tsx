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
import { useTasksBoundedStore } from '@/store/smartlist/smartlist-tasks-bounded'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Plus } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

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

type NewTaskData = z.infer<typeof newTaskSchema>

interface SheetNewTask {
  boundId: string
}

export function SheetNewTask({ boundId }: SheetNewTask) {
  const { task, loadTasksBounded, control } = useTasksBoundedStore(
    ({ task, loadTasksBounded, control }) => {
      const taskFormatted = task
        ? task?.map(({ id, description }) => ({
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
  const newTaskForm = useForm<NewTaskData>({
    resolver: zodResolver(newTaskSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = newTaskForm

  const { toast } = useToast()

  async function handleNewTask(data: NewTaskData) {
    await api
      .post(`/smart-list/bound/${boundId}/item`, {
        controlId: Number(data.control),
        taskId: Number(data.task),
      })
      .then((res) => res.data)
      .catch((err: AxiosError<{ message: string }>) =>
        toast({
          title: err.response?.data.message,
          description: err.message,
          variant: 'destructive',
          duration: 1000 * 10,
        }),
      )

    // if (!response?.inserted) return

    toast({
      title: 'Task criada com sucesso!',
      variant: 'success',
    })
    reset({ control: '', task: [] })
    loadTasksBounded(boundId)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Vincular tarefa
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-md">
        <SheetTitle>Vincular tarefa</SheetTitle>
        <FormProvider {...newTaskForm}>
          <form
            className="mt-4 flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleNewTask)}
          >
            <Form.Field>
              <Form.Label>Tarefas:</Form.Label>
              <Form.MultiSelect name="task" options={task} />
              <Form.ErrorMessage field="task" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Controle:</Form.Label>
              <Form.Select name="control" options={control} />
              <Form.ErrorMessage field="control" />
            </Form.Field>

            <Button disabled={isSubmitting} loading={isSubmitting}>
              <Plus className="h-4 w-4" />
              Vincular
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
