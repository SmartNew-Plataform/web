'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { WizardForm } from '@/components/wizard-form'
import { WizardFormStep } from '@/components/wizard-form/wizard-form-step'
import { useWizardForm } from '@/hooks/use-wizard-form'
import { api } from '@/lib/api'
import { useServiceOrderChecklist } from '@/store/maintenance/service-order-checklist'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { z } from 'zod'

interface ResponsesProps {
  checklistId?: number
}

type TaskData = {
  id: number
  task: {
    id: number
    description: string
    children: Array<{
      id: number
      description: string
      control: {
        id: number
        description: string
      }
      status: {
        id: number
        description: string
      }
    }>
  }
  answer: string
  observation?: string
}

type StatusOption = {
  value: string
  label: string
  color: string
  action: boolean
  checkListControl: string
}

const responsesSchema = z.object({
  checklist: z.array(
    z.object({
      id: z.number(),
      answer: z.string(),
      children: z.string().optional(),
      attach: z.instanceof(File).array().optional(),
      observation: z.string().optional().nullable(),
    }),
  ),
})

type ResponsesData = z.infer<typeof responsesSchema>

export function Responses({ checklistId }: ResponsesProps) {
  const checklistWizard = useWizardForm()
  const { paginate, percentSteps, firstStep, lastStep } = checklistWizard
  const responsesForm = useForm<ResponsesData>({
    resolver: zodResolver(responsesSchema),
  })
  const { handleSubmit, control, watch } = responsesForm
  const { fields, replace } = useFieldArray({
    control,
    name: 'checklist',
  })
  const params = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { setSheetChecklistOpen } = useServiceOrderChecklist()

  async function handleSubmitResponses(data: ResponsesData) {
    console.log(data)

    for await (const { id, attach } of data.checklist) {
      if (!attach) return
      await Promise.all(
        attach?.map((file) => {
          const formData = new FormData()
          formData.append('file', file)
          return api.post(`smart-list/check-list/insert-attach/${id}`, formData)
        }),
      )
    }

    const response = await api.put(
      `/maintenance/service-order/${params.serviceOrderId}/check-list/${checklistId}`,
      {
        checklist: data.checklist.map(
          ({ answer, children, id, observation }) => ({
            id,
            answer: Number(answer),
            children: Number(children),
            observation,
          }),
        ),
      },
    )

    if (response.status !== 200) return

    toast({
      title: 'Checklist criado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['maintenance-checklist-table'])
    setSheetChecklistOpen(false)
  }

  function getTask(index: number) {
    if (!data) return
    const task = data.tasks[index].task

    return task
  }

  const { data } = useQuery({
    queryKey: [`maintenance/checklist/responses/${checklistId}`],
    queryFn: async () => {
      if (!checklistId) return

      const [taskResponse, statusResponse] = await Promise.all([
        api.get<{ data: TaskData[] }>(
          `/maintenance/service-order/${params.serviceOrderId}/check-list/${checklistId}`,
        ),
        api.get<{ data: StatusOption[] }>(`/system/choices/check-list-status`),
      ])

      replace(taskResponse.data.data)

      return {
        tasks: taskResponse.data.data,
        statusOption: statusResponse.data.data,
      }
    },
    retry: false,
    refetchOnMount: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })

  return (
    <>
      <FormProvider {...responsesForm}>
        <form
          onSubmit={handleSubmit(handleSubmitResponses)}
          className="flex h-full w-full flex-col gap-4"
        >
          {!data?.tasks ? (
            <Skeleton className="h-10 w-10 rounded" />
          ) : (
            <WizardForm {...checklistWizard} className="w-full">
              {fields?.map(({ id }, index) => {
                const task = getTask(index)
                const rowId = data.tasks[index].id
                const controlId = watch(`checklist.${index}.answer`)
                const currentStatusOption = data.statusOption.find(
                  ({ value }) => value === controlId,
                )
                const child = task?.children.filter(({ status }) => {
                  return status.id.toString() === controlId
                })
                // console.log(child)

                return (
                  <WizardFormStep className="w-full" key={id}>
                    <strong>{task?.description}</strong>
                    <Form.Input
                      type="hidden"
                      name={`checklist.${index}.id`}
                      value={rowId}
                    />
                    <Form.Checklist index={index} type="STATUS" />
                    <Form.ErrorMessage field={`checklist.${index}.answer`} />

                    <Controller
                      key={id}
                      name={`checklist.${index}.children`}
                      control={control}
                      render={({ field }) => (
                        <Form.RadioGroup {...field}>
                          {child?.map(({ id: idChild, description }) => (
                            <Form.Label
                              className="flex items-center gap-2"
                              key={idChild}
                            >
                              <RadioGroupItem value={idChild.toString()} />
                              {description}
                            </Form.Label>
                          ))}
                        </Form.RadioGroup>
                      )}
                    />

                    {currentStatusOption?.action && (
                      <Form.AttachDragDrop name={`checklist.${index}.attach`} />
                    )}

                    <Form.Field>
                      <Form.Label>Obervação:</Form.Label>
                      <Form.Textarea name={`checklist.${index}.observation`} />
                      <Form.ErrorMessage
                        field={`checklist.${index}.observation`}
                      />
                    </Form.Field>
                  </WizardFormStep>
                )
              })}
            </WizardForm>
          )}
          <div className="relative flex items-end justify-between gap-4">
            <AnimatePresence>
              {lastStep && (
                <motion.div
                  className="absolute -top-10 flex w-full justify-center"
                  initial={{
                    y: 100,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  exit={{
                    y: 100,
                    opacity: 0,
                  }}
                  transition={{
                    y: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Button
                    variant="success"
                    className="rounded-full shadow-xl"
                    type="submit"
                  >
                    <Save size={16} />
                    Salvar checklist
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate({ newDirection: -1 })}
              disabled={firstStep}
              type="button"
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full bg-violet-500"
                animate={{ width: `${percentSteps}%` }}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate({ newDirection: 1 })}
              disabled={lastStep}
              type="button"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}
