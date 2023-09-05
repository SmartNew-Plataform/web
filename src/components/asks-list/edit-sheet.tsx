'use client'
import { api } from '@/lib/api'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
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
  const editFormSchema = z.object({
    answer: z.string(),
    children: z.string().optional(),
    images: z.instanceof(FileList).optional(),
  })

  type EditFormData = z.infer<typeof editFormSchema>

  const { toast } = useToast()

  const { checklistAsksScreen } = useCoreScreensStore(
    ({ checklistAsksScreen }) => ({
      checklistAsksScreen,
    }),
  )

  const editAskForm = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
  })
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = editAskForm

  async function handleEditAsk(data: EditFormData) {
    const answerHasChild = checklistAsksScreen?.editingAsk?.answer?.some(
      ({ id, children }) => String(id) === data.answer && children.length > 0,
    )
    console.log(answerHasChild, !data.children)

    if (answerHasChild && !data.children) {
      toast({
        title: 'O filho da resposta principal e obrigatorio',
        variant: 'destructive',
      })
      return
    }

    const taskId = checklistAsksScreen?.editingAsk?.id
    api.put(`/smart-list/check-list/update-task/${taskId}`, data)

    console.log(data)
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
                {checklistAsksScreen?.editingAsk?.description}
              </SheetTitle>
              <SheetDescription>
                {checklistAsksScreen?.editingAsk?.description}
              </SheetDescription>
            </SheetHeader>

            <FormProvider {...editAskForm}>
              <form
                onSubmit={handleSubmit(handleEditAsk)}
                className="flex h-full flex-1 flex-col gap-3"
              >
                <AnswerModels data={checklistAsksScreen.editingAsk.answer} />

                <Controller
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
                />

                <p>{errors?.images?.message}</p>
                <p>{errors?.answer?.message}</p>
                <p>{errors?.children?.message}</p>
                <p>{errors?.root?.message}</p>

                <div className="flex flex-wrap gap-2">
                  {checklistAsksScreen.editingAsk.images?.map((src) => (
                    <Image
                      className="rounded"
                      objectFit="cover"
                      height={80}
                      width={80}
                      key={src.url}
                      src={src.url}
                      alt={src.url}
                    />
                  ))}
                </div>

                <Button type="submit">Enviar</Button>
              </form>
            </FormProvider>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
