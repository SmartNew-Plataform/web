'use client'
import { AttachList } from '@/components/attach-list'
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
  descriptionAction: z.string(),
  attach: z.instanceof(File).array(),
})

type ActionFormType = z.infer<typeof actionFormSchema>

type SheetActionProps = ComponentProps<typeof Sheet>

export function SheetAction(props: SheetActionProps) {
  const {
    responsible,
    attach,
    currentTask,
    fetchActionList,
    setCurrentTask,
    fetchAttach,
  } = useActionsStore(
    ({
      responsible,
      currentTask,
      fetchActionList,
      fetchAttach,
      setCurrentTask,
      attach,
    }) => {
      return {
        attach: attach?.map(({ url }) => url),
        fetchActionList,
        fetchAttach,
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
  const isDone = !!currentTask?.doneAt

  const { toast } = useToast()

  async function handleCreateAction(data: ActionFormType) {
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
  }

  async function handleUpdateAction(data: ActionFormType) {
    try {
      const response = await api
        .put('smart-list/action', {
          itemId: currentTask?.id,
          actionId: currentTask?.actionId,
          ...data,
        })
        .then((res) => res.data)

      Array.from(data.attach).forEach(async (image) => {
        const formData = new FormData()
        formData.append('file', image)
        const responseAttach = await api
          .post(
            `smart-list/action/insert-attach/${currentTask?.actionId}`,
            formData,
          )
          .then((res) => res.data)

        if (responseAttach?.inserted)
          toast({
            title: 'Erro ao inserir imagem!',
            description: image.name,
            variant: 'destructive',
          })
      })

      fetchActionList()
      fetchAttach(currentTask!.actionId!)
      setCurrentTask(response)
      setValue('attach', [])
      toast({
        title: 'Ação atualizada com sucesso!',
        variant: 'success',
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function handleDeleteAttach(url: string) {
    const path = url.split('https://www.smartnewsystem.com.br/')[1]

    const response = await api
      .delete(`/smart-list/action/delete-attach/${currentTask?.actionId}`, {
        data: {
          urlFile: path,
        },
      })
      .then((res) => res.data)

    if (response?.delete) {
      fetchAttach(currentTask!.actionId!)
      toast({
        title: 'Imagem deletada com sucesso!',
        variant: 'success',
      })
    }
  }

  useEffect(() => {
    reset()
    if (!currentTask) return
    setValue('description', currentTask.description || '')
    setValue('descriptionAction', currentTask.descriptionAction || '')
    setValue('responsible', currentTask?.responsible?.login || '')
    if (currentTask.endDate)
      setValue('deadline', dayjs(currentTask.endDate).toDate())
    if (currentTask.doneAt)
      setValue('doneAt', dayjs(currentTask.doneAt).toDate())
  }, [currentTask])

  return (
    <Sheet {...props}>
      <SheetContent className="max-w-md overflow-auto p-4">
        <div className="relative h-full w-full py-4">
          <span className="mb-6 flex items-center gap-1 font-medium">
            Status:
            <span className="ml-2 rounded bg-slate-200 px-2 py-1 font-semibold text-slate-700">
              {currentTask?.status}
            </span>
          </span>
          <FormProvider {...actionForm}>
            <form
              className="flex w-full flex-col gap-3"
              onSubmit={handleSubmit(
                isNewAction ? handleCreateAction : handleUpdateAction,
              )}
            >
              <Form.Field>
                <Form.Label htmlFor="description">Ação:</Form.Label>
                <Form.Textarea
                  disabled={isDone}
                  id="description"
                  name="description"
                />
                <Form.ErrorMessage field="description" />
              </Form.Field>

              {!responsible ? (
                <Form.SkeletonField />
              ) : (
                <Form.Field>
                  <Form.Label htmlFor="responsible">Responsável:</Form.Label>
                  <Form.Select
                    options={responsible || []}
                    id="responsible"
                    name="responsible"
                    disabled={isDone}
                  />
                  <Form.ErrorMessage field="responsible" />
                </Form.Field>
              )}

              <Form.Field>
                <Form.Label htmlFor="deadline">Prazo:</Form.Label>
                <Form.DatePicker
                  disabled={isDone}
                  id="deadline"
                  name="deadline"
                />
                <Form.ErrorMessage field="deadline" />
              </Form.Field>

              <Form.Field>
                <Form.Label htmlFor="doneAt">Data Conclusão:</Form.Label>
                <Form.DatePicker
                  id="doneAt"
                  disabled={isNewAction || isDone}
                  name="doneAt"
                />
                <Form.ErrorMessage field="doneAt" />
              </Form.Field>

              <Form.Field>
                <Form.Label htmlFor="descriptionAction">
                  Descrição ação:
                </Form.Label>
                <Form.Textarea
                  disabled={isNewAction || isDone}
                  id="descriptionAction"
                  name="descriptionAction"
                />
                <Form.ErrorMessage field="descriptionAction" />
              </Form.Field>

              <Form.Field>
                <Form.Label htmlFor="attach">Anexo:</Form.Label>
                <Form.ImagePicker
                  id="attach"
                  disabled={isNewAction || isDone}
                  name="attach"
                  multiple
                />
                <Form.ErrorMessage field="attach" />
              </Form.Field>

              <AttachList
                data={attach || []}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onDelete={!isDone ? handleDeleteAttach : () => {}}
              />

              <div className="sticky bottom-0 bg-white py-4">
                <Button
                  loading={isSubmitting}
                  disabled={isDone}
                  className="w-full"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </SheetContent>
    </Sheet>
  )
}
