'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useTasksStore } from '@/store/smartlist/smartlist-task'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const changeSituationSchema = z.object({
  status: z.string({ required_error: 'Selecione um status!' }),
  description: z.string({ required_error: 'Digite uma legenda pra ação!' }),
  type: z.string({ required_error: 'Selecione o tipo da ação!' }),
  impediment: z
    .boolean({ required_error: 'Este campo e obrigatório!' })
    .default(false),
})

type ChangeSituationData = z.infer<typeof changeSituationSchema>

type ActionType = {
  control: string
  description: string
  id: string
  impediment: boolean
}

interface SituationForm {
  taskId: string
}

export function SituationForm({ taskId }: SituationForm) {
  const { status, types } = useTasksStore(({ status, types }) => {
    const statusFormatted = status
      ? status?.map(({ description, id }) => ({
          label: description,
          value: id.toString(),
        }))
      : []

    const typesFormatted = types
      ? types.map(({ description, id }) => ({
          label: description,
          value: id.toString(),
        }))
      : []

    return { status: statusFormatted, types: typesFormatted }
  })
  const [actions, setActions] = useState<ActionType[] | undefined>([])
  const [editingAction, setEditingAction] = useState<string | null>()

  const situationForm = useForm<ChangeSituationData>({
    resolver: zodResolver(changeSituationSchema),
  })
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
    reset,
  } = situationForm

  const statusId = watch('status')

  async function handleChangeControl(data: ChangeSituationData) {
    const response = await api.post(
      `/smart-list/task/${taskId}/statusAction/${statusId}`,
      {
        controlId: Number(data.type),
        description: data.description,
        impediment: data.impediment,
      },
    )

    reset({
      status: statusId,
      type: '',
      description: '',
      impediment: false,
    })

    handleChangeStatus()
  }

  useEffect(() => {
    if (!statusId) return

    handleChangeStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusId])

  async function handleChangeStatus() {
    const response = await api
      .get(`/smart-list/task/${taskId}/statusAction/${statusId}`)
      .then((res) => res.data)

    setActions(response.statusAction)
  }

  function handleToggleEditingAction(actionId: string) {
    const newActionIdValue = actionId === editingAction ? null : actionId
    setEditingAction(newActionIdValue)

    const currentAction = actions?.find(({ id }) => id === actionId)
  }

  return (
    <FormProvider {...situationForm}>
      <form
        onSubmit={handleSubmit(handleChangeControl)}
        className="mt-4 flex h-full w-full flex-col gap-3 overflow-auto"
      >
        <Form.Field>
          <Form.Label>Controle:</Form.Label>
          <Form.Select name="status" options={status} />
          <Form.ErrorMessage field="status" />
        </Form.Field>

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
          <Form.Checkbox id="impeditive" name="impediment" />
          <Form.Label htmlFor="impeditive">Impeditivo</Form.Label>
          <Form.ErrorMessage field="impeditive" />
        </Form.Field>

        <Separator />

        <div className="flex h-full flex-col gap-3 overflow-auto">
          {actions?.map(({ id, description, control }) => {
            return (
              <div
                key={id}
                className={cn('flex justify-between rounded-2xl border p-4', {
                  'border-2 border-violet-500 bg-violet-200':
                    editingAction === id,
                })}
              >
                <div className="flex gap-2 divide-x divide-slate-300">
                  <span>{control}</span>
                  <span className="pl-2 font-semibold text-slate-700">
                    {description}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="destructive" size="icon-xs">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-xs"
                    onClick={() => handleToggleEditingAction(id)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <Button loading={isSubmitting} disabled={isSubmitting}>
          <Save className="h-4 w-4" />
          Salvar situação
        </Button>
      </form>
    </FormProvider>
  )
}
