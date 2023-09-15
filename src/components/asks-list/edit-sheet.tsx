'use client'
import { api } from '@/lib/api'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../form'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Skeleton } from '../ui/skeleton'
import { useToast } from '../ui/use-toast'
import { AnswerModels } from './answer-models'

interface EditSheetProps {
  setSheetOpen: Dispatch<SetStateAction<boolean>>
  sheetOpen: boolean
}

export function EditSheet({ sheetOpen, setSheetOpen }: EditSheetProps) {
  const {
    checklistAsksScreen,
    loadChecklistAsks,
    deleteImageFromAsk,
    checkIfAnswerHasChild,
  } = useCoreScreensStore(
    ({
      checklistAsksScreen,
      loadChecklistAsks,
      deleteImageFromAsk,
      checkIfAnswerHasChild,
    }) => ({
      checklistAsksScreen,
      loadChecklistAsks,
      deleteImageFromAsk,
      checkIfAnswerHasChild,
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
    images: z
      .instanceof(File)
      .array()
      .refine((images) => {
        if (!checklistAsksScreen?.editingAsk) return

        const allImages = checklistAsksScreen?.editingAsk?.images
        const hasChild = checklistAsksScreen?.editingAsk?.currentAnswerHasChild
        const hasImages = allImages && images.length > 0

        if (hasChild && !hasImages) {
          return images.length !== 0
        } else {
          return true
        }
      }, 'A imagem é obrigatória'),
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
  const { handleSubmit, setValue, reset } = editAskForm

  useEffect(() => {
    reset()
    setValue('answer', String(checklistAsksScreen?.editingAsk?.answer?.id))
    setValue('observation', checklistAsksScreen?.editingAsk?.observation || '')
    setValue(
      'children',
      String(checklistAsksScreen?.editingAsk?.answer?.child?.id),
    )
    checkIfAnswerHasChild(checklistAsksScreen?.editingAsk?.answer?.id || 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checklistAsksScreen?.editingAsk?.answer])

  async function handleEditAsk(data: EditFormData) {
    const taskId = checklistAsksScreen?.editingAsk?.id

    Array.from(data.images).forEach(async (image) => {
      const formData = new FormData()
      formData.append('file', image)
      const response = await api
        .post(`smart-list/check-list/insert-attach/${taskId}`, formData)
        .then((res) => res.data)

      if (response?.inserted)
        toast({
          title: 'Erro ao inserir imagem!',
          description: image.name,
          variant: 'destructive',
        })
    })

    const options = {
      answerId: Number(data.answer),
      childId: Number(data.children),
      observation: data.observation,
    }

    setIsUpdating(true)
    const response = await api
      .put(`/smart-list/check-list/update-task/${taskId}`, options)
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

  async function handleDeleteImage(index: number) {
    if (!checklistAsksScreen?.editingAsk?.images) return
    const url = checklistAsksScreen?.editingAsk?.images[index].url
    const taskId = checklistAsksScreen?.editingAsk?.id
    const path = url.split('checkList/')[1]

    const response = await api
      .delete(`/smart-list/check-list/delete-attach/${taskId}`, {
        data: {
          urlFile: path,
        },
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

    if (response?.delete) {
      deleteImageFromAsk(index)
      toast({
        title: 'Imagem deletada com sucesso!',
        variant: 'success',
      })
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
            <SheetHeader className="mb-4 space-y-2">
              <span className="text-sm font-semibold text-slate-600">
                {checklistAsksScreen?.editingAsk?.id}
              </span>
              <SheetTitle>
                {checklistAsksScreen?.editingAsk?.description}
              </SheetTitle>
            </SheetHeader>

            <FormProvider {...editAskForm}>
              <form
                onSubmit={handleSubmit(handleEditAsk)}
                className="flex h-full flex-1 flex-col gap-3"
              >
                <AnswerModels data={checklistAsksScreen.editingAsk.options} />

                {checklistAsksScreen.editingAsk.currentAnswerHasChild && (
                  <Form.ImagePicker name="images" multiple />
                )}

                <div className="flex flex-wrap gap-2">
                  {checklistAsksScreen.editingAsk.images?.map((src, index) => (
                    <Dialog key={src.url}>
                      <div className="relative border">
                        <Button
                          size="icon-xs"
                          variant="destructive"
                          className="absolute right-1 top-1"
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <DialogTrigger asChild>
                          <Image
                            className="h-[80px] rounded object-cover"
                            objectFit="cover"
                            height={80}
                            width={80}
                            src={src.url}
                            alt={src.url}
                          />
                        </DialogTrigger>
                      </div>
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
                  <Form.ErrorMessage field="images" />
                </div>

                <Form.Field>
                  <Form.Label htmlFor="observation-checklist">
                    Observação:
                  </Form.Label>
                  <Form.Textarea
                    name="observation"
                    id="observation-checklist"
                  />
                  <Form.ErrorMessage field="observation" />
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
