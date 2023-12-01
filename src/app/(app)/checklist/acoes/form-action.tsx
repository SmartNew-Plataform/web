'use client'
import { AttachList } from '@/components/attach-list'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Save } from 'lucide-react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { InfoData } from './sheet-action'

const actionFormSchema = z.object({
  description: z
    .string({ required_error: 'Este campo e obrigatório!' })
    .nonempty({ message: 'O campo não pode estar vazio!' }),
  responsible: z.string({ required_error: 'Este campo e obrigatório' }),
  deadline: z.date({ required_error: 'Este campo e obrigatório!' }),
  doneAt: z.date().optional(),
  descriptionAction: z.string().optional(),
  attach: z.instanceof(File).array(),
})

type ActionFormType = z.infer<typeof actionFormSchema>

interface FormActionProps {
  dataTask: InfoData
  handleSubmitGroupForm: (data: ActionFormType) => Promise<void>
}

export function FormAction({
  dataTask,
  handleSubmitGroupForm,
}: FormActionProps) {
  const { responsible, attach } = useActionsStore(
    ({ responsible, attach, ...rest }) => {
      return {
        attach: attach?.map(({ url }) => url),
        responsible: responsible?.map(({ login, name }) => ({
          value: login,
          label: name,
        })),
        ...rest,
      }
    },
  )
  const { toast } = useToast()
  const actionForm = useForm<ActionFormType>({
    resolver: zodResolver(actionFormSchema),
  })
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = actionForm
  const isNewAction = !dataTask.code
  const isDone = !!dataTask.doneAt

  async function handleDeleteAttach(url: string) {
    const path = url.split('https://www.smartnewsystem.com.br/')[1]

    // const response = await api
    //   .delete(`/smart-list/action/delete-attach/${currentTask?.actionId}`, {
    //     data: {
    //       urlFile: path,
    //     },
    //   })
    //   .then((res) => res.data)

    // if (response?.delete) {
    //   // fetchAttach(currentTask!.actionId!)
    //   toast({
    //     title: 'Imagem deletada com sucesso!',
    //     variant: 'success',
    //   })
    // }
  }

  // useEffect(() => {
  //   reset()
  //   if (!currentTask) return
  //   setValue('description', currentTask.description || '')
  //   setValue('descriptionAction', currentTask.descriptionAction || '')
  //   setValue('responsible', currentTask?.responsible?.login || '')
  //   if (currentTask.endDate)
  //     setValue('deadline', dayjs(currentTask.endDate).toDate())
  //   if (currentTask.doneAt)
  //     setValue('doneAt', dayjs(currentTask.doneAt).toDate())
  // }, [currentTask])
  return (
    <div className="relative w-full max-w-sm">
      <span className="mb-6 flex items-center gap-1 font-medium">
        Status:
        <span className="ml-2 rounded bg-slate-200 px-2 py-1 font-semibold text-slate-700">
          {dataTask.status}
        </span>
      </span>
      <FormProvider {...actionForm}>
        <form
          className="flex w-full flex-col gap-3"
          onSubmit={handleSubmit(handleSubmitGroupForm)}
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
            <Form.DatePicker disabled={isDone} id="deadline" name="deadline" />
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
            <Form.Label htmlFor="descriptionAction">Descrição ação:</Form.Label>
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
            <Button loading={isSubmitting} disabled={isDone} className="w-full">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
