'use client'
import { api } from '@/lib/api'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../form'
import { ErrorMessage } from '../form/ErrorMessage'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'
import { Skeleton } from '../ui/skeleton'
import { useToast } from '../ui/use-toast'
import { AnswerModels } from './answer-models'

interface EditSheetProps {
  setSheetOpen: Dispatch<SetStateAction<boolean>>
  sheetOpen: boolean
}

export function EditSheet({ sheetOpen, setSheetOpen }: EditSheetProps) {
  const { checklistAsksScreen, loadChecklistAsks } = useCoreScreensStore(
    ({ checklistAsksScreen, loadChecklistAsks }) => ({
      checklistAsksScreen,
      loadChecklistAsks,
    }),
  )

  const editFormSchema = z.object({
    answer: z.string(),
    children: z.string().refine((children) => {
      const hasChild = checklistAsksScreen?.editingAsk?.currentAnswerHasChild
      const childAnswered = children !== 'undefined' && children.length !== 0

      if (hasChild) {
        return childAnswered
      } else {
        return true
      }
    }, 'A justificativa é obrigatória'),
    images: z.instanceof(FileList).optional(),
    observation: z.string().refine((observation) => {
      const hasChild = checklistAsksScreen?.editingAsk?.currentAnswerHasChild

      if (hasChild) {
        return observation.length !== 0
      } else {
        return true
      }
    }, 'A observação e obrigatoria'),
  })
  type EditFormData = z.infer<typeof editFormSchema>
  const { toast } = useToast()
  const editAskForm = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const { handleSubmit, setValue } = editAskForm

  useEffect(() => {
    setValue('answer', String(checklistAsksScreen?.editingAsk?.answer?.id))
    setValue('observation', checklistAsksScreen?.editingAsk?.observation || '')
    setValue(
      'children',
      String(checklistAsksScreen?.editingAsk?.answer?.child?.id),
    )
  }, [checklistAsksScreen?.editingAsk?.answer])

  async function handleEditAsk(data: EditFormData) {
    const answerHasChild = checklistAsksScreen?.editingAsk?.options?.some(
      ({ id, children }) => String(id) === data.answer && children.length > 0,
    )

    if (answerHasChild && !data.children) {
      toast({
        title: 'O filho da resposta principal e obrigatorio',
        variant: 'destructive',
      })
      return
    }

    const taskId = checklistAsksScreen?.editingAsk?.id

    setIsUpdating(true)
    const response = await api
      .put(`/smart-list/check-list/update-task/${taskId}`, {
        answerId: Number(data.answer),
        childId: Number(data.children),
        observation: data.observation,
      })
      .then((res) => res.data)
      .catch((err: AxiosError<{ message: string }>) => {
        toast({
          title: err.message,
          description: err.response?.data.message,
          variant: 'destructive',
          duration: 1000 * 120,
        })
      })
      .finally(() => setIsUpdating(false))

    if (response.updated) {
      toast({
        title: 'Tarefa atualizada com sucesso!',
        variant: 'success',
      })
      setSheetOpen(false)
      loadChecklistAsks(String(checklistAsksScreen?.id))
    }
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent className="max-h-screen w-[500px] max-w-4xl">
        {!checklistAsksScreen?.editingAsk ? (
          <div className="flex w-full flex-col gap-4">
            <Skeleton className="h-8" />

            <div className="flex gap-2">
              <Skeleton className="aspect-square flex-1" />
              <Skeleton className="aspect-square flex-1" />
              <Skeleton className="aspect-square flex-1" />
            </div>
          </div>
        ) : (
          <>
            <SheetHeader className="mb-4">
              <SheetTitle>
                {checklistAsksScreen?.editingAsk?.description} -{' '}
                {checklistAsksScreen?.editingAsk?.id}
              </SheetTitle>
              <SheetDescription>
                {checklistAsksScreen?.editingAsk?.observation}
              </SheetDescription>
            </SheetHeader>

            <FormProvider {...editAskForm}>
              <form
                onSubmit={handleSubmit(handleEditAsk)}
                className="flex h-full flex-1 flex-col gap-3"
              >
                <AnswerModels data={checklistAsksScreen.editingAsk.options} />

                {/* <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <Input
                      name={field.name}
                      onChange={(e) => field.onChange(e.target.files)}
                      multiple
                      type="file"
                    />
                  )}
                /> */}

                <div className="flex flex-wrap gap-2">
                  {checklistAsksScreen.editingAsk.images?.map((src) => (
                    <Dialog key={src.url}>
                      <DialogTrigger asChild>
                        <Image
                          className="rounded"
                          objectFit="cover"
                          height={80}
                          width={80}
                          src={src.url}
                          alt={src.url}
                        />
                      </DialogTrigger>
                      <DialogContent className="p-0">
                        <Image
                          className="rounded"
                          objectFit="cover"
                          width={510}
                          height={680}
                          src={src.url}
                          alt={src.url}
                        />
                      </DialogContent>
                    </Dialog>
                  ))}
                  <ErrorMessage field="images" />
                </div>

                <Form.Field>
                  <Form.Label htmlFor="observation-checklist">
                    Observação:
                  </Form.Label>
                  <Form.Textarea
                    name="observation"
                    id="observation-checklist"
                  />
                  <ErrorMessage field="observation" />
                </Form.Field>

                <Button
                  loading={isUpdating}
                  disabled={isUpdating}
                  type="submit"
                >
                  Enviar
                </Button>
              </form>
            </FormProvider>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
