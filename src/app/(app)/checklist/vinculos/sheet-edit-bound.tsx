'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useBoundStore } from '@/store/smartlist/smartlist-bound'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Save } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface SheetEditBoundProps {
  boundId: number | null
  onOpenChange: Dispatch<SetStateAction<number | null>>
}

const editBoundSchema = z.object({
  description: z
    .string({ required_error: 'A descrição e obrigatoria!' })
    .nonempty({ message: 'Preencha a descrição' }),
})

type EditBoundData = z.infer<typeof editBoundSchema>

export function SheetEditBound({ boundId, onOpenChange }: SheetEditBoundProps) {
  const { bounds } = useBoundStore()

  const newBoundForm = useForm<EditBoundData>({
    resolver: zodResolver(editBoundSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = newBoundForm

  const { toast } = useToast()
  const queryClient = useQueryClient()

  useEffect(() => {
    const bound = bounds?.find(({ id }) => id === boundId)

    setValue('description', bound?.description || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundId])

  async function handleEditNewBound(data: EditBoundData) {
    const response = await api
      .put(`/smart-list/bound/${boundId}`, data)
      .then((res) => res.data)
      .catch((err: AxiosError<{ message: string }>) =>
        toast({
          title: err.response?.data.message,
          description: err.message,
          variant: 'destructive',
          duration: 1000 * 10,
        }),
      )

    if (response?.error) return

    toast({
      title: 'Vinculo atualizado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['checklist/bounds'])
    onOpenChange(null)
  }

  return (
    <Sheet
      open={!!boundId}
      onOpenChange={(open) => onOpenChange(open ? boundId : null)}
    >
      <SheetContent className="max-w-md">
        <SheetTitle>Editar vinculo</SheetTitle>
        <FormProvider {...newBoundForm}>
          <form
            className="mt-4 flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleEditNewBound)}
          >
            <Form.Field>
              <Form.Label>Descrição:</Form.Label>
              <Form.Input name="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Button disabled={isSubmitting} loading={isSubmitting}>
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
