'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const actionFormSchema = z.object({
  description: z
    .string({ required_error: 'Este campo e obrigatório!' })
    .nonempty({ message: 'O campo não pode estar vazio!' }),
  responsible: z.string({ required_error: 'Este campo e obrigatório' }),
  deadline: z.date({ required_error: 'Este campo e obrigatório!' }),
  doneAt: z.date().optional(),
  attach: z.instanceof(File).array(),
})

type ActionFormType = z.infer<typeof actionFormSchema>

type SheetActionProps = ComponentProps<typeof Sheet>

export function SheetAction(props: SheetActionProps) {
  const { responsible, currentTask, fetchActionList, setCurrentTask } =
    useActionsStore(
      ({ responsible, currentTask, fetchActionList, setCurrentTask }) => {
        return {
          fetchActionList,
          setCurrentTask,
          currentTask,
          responsible: responsible?.map(({ login, name }) => ({
            value: login,
            label: name,
          })),
        }
      },
    )
  const actionForm = useForm<ActionFormType>({
    resolver: zodResolver(actionFormSchema),
  })
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = actionForm
  const isNewAction = !currentTask?.actionId

  const { toast } = useToast()

  async function handleCreateAction(data: ActionFormType) {
    try {
      const response: ActionItem = await api
        .post('smart-list/action', {
          itemId: currentTask?.id,
          ...data,
        })
        .then((res) => res.data)

      fetchActionList()
      setCurrentTask(response)
      toast({
        title: 'Ação criada com sucesso!',
        variant: 'success',
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function handleUpdateAction(data: ActionFormType) {
    try {
      await api.put('smart-list/action', {
        itemId: currentTask?.id,
        actionId: currentTask?.actionId,
        ...data,
      })

      fetchActionList()
      toast({
        title: 'Ação atualizada com sucesso!',
        variant: 'success',
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    reset()
    if (!currentTask) return
    setValue('description', currentTask.description || '')
    setValue('responsible', currentTask?.responsible?.login || '')
    if (currentTask.endDate)
      setValue('deadline', dayjs(currentTask.endDate).toDate())
    if (currentTask.doneAt)
      setValue('doneAt', dayjs(currentTask.doneAt).toDate())
  }, [currentTask])

  return (
    <Sheet {...props}>
      <SheetContent className="max-w-md overflow-auto">
        <FormProvider {...actionForm}>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={handleSubmit(
              isNewAction ? handleCreateAction : handleUpdateAction,
            )}
          >
            <Form.Field>
              <Form.Label htmlFor="description">Ação:</Form.Label>
              <Form.Textarea id="description" name="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="responsible">Responsável:</Form.Label>
              <Form.Select
                options={responsible || []}
                id="responsible"
                name="responsible"
              />
              <Form.ErrorMessage field="responsible" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="deadline">Prazo:</Form.Label>
              <Form.DatePicker id="deadline" name="deadline" />
              <Form.ErrorMessage field="deadline" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="doneAt">Data Conclusão:</Form.Label>
              <Form.DatePicker
                id="doneAt"
                disabled={isNewAction}
                name="doneAt"
              />
              <Form.ErrorMessage field="doneAt" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="attach">Anexo:</Form.Label>
              <Form.ImagePicker
                id="attach"
                disabled={isNewAction}
                name="attach"
              />
              <Form.ErrorMessage field="attach" />
            </Form.Field>

            <Button loading={isSubmitting}>
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
