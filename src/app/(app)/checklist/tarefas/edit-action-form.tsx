'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useTasksStore } from '@/store/smartlist/smartlist-task'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil, Save } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ActionType } from './situation-form'

const editActionSchema = z.object({
  description: z.string({ required_error: 'Digite uma legenda pra ação!' }),
  type: z.string({ required_error: 'Selecione o tipo da ação!' }),
  impediment: z
    .boolean({ required_error: 'Este campo e obrigatório!' })
    .default(false),
})

type EditActionData = z.infer<typeof editActionSchema>

interface EditActionFormProps extends ActionType {
  taskId: string
  statusId: string
  loadActions: () => void
}

export function EditActionForm({
  description,
  impediment,
  control,
  taskId,
  statusId,
  id,
}: EditActionFormProps) {
  const editActionForm = useForm<EditActionData>({
    resolver: zodResolver(editActionSchema),
    defaultValues: {
      description,
      impediment,
      type: String(control.id),
    },
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = editActionForm
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { types } = useTasksStore(({ types }) => {
    const typesFormatted = types
      ? types.map(({ description, id }) => ({
          label: description,
          value: id.toString(),
        }))
      : []

    return { types: typesFormatted }
  })

  async function handleEditAction(data: EditActionData) {
    const response = await api
      .put(`smart-list/task/${taskId}/statusAction/${statusId}/${id}`, {
        controlId: Number(data.type),
        description: data.description,
        impediment: data.impediment,
      })
      .then((res) => res.data)

    if (response?.updated) {
      toast({
        title: 'Ação atualizada com sucesso!',
        variant: 'success',
      })
    }
    queryClient.refetchQueries(['checklist/tasks/situations'])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" size="icon-xs">
          <Pencil className="h-3 w-3" />
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <FormProvider {...editActionForm}>
          <form
            onSubmit={handleSubmit(handleEditAction)}
            className="flex w-full flex-col gap-3"
          >
            <Form.Field>
              <Form.Label>Descrição:</Form.Label>
              <Form.Input name="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Tipo:</Form.Label>
              <Form.Select name="type" options={types} />
              <Form.ErrorMessage field="type" />
            </Form.Field>

            <Form.Field className="flex-row">
              <Form.Checkbox id="impeditive-edit" name="impediment" />
              <Form.Label htmlFor="impeditive-edit">Impeditivo</Form.Label>
              <Form.ErrorMessage field="impeditive" />
            </Form.Field>

            <Button loading={isSubmitting} disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </PopoverContent>
    </Popover>
  )
}
