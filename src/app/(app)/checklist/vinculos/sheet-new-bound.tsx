'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useBoundStore } from '@/store/smartlist/smartlist-bound'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const newBoundSchema = z.object({
  family: z
    .string({
      required_error: 'A família e obrigatoria!',
      invalid_type_error: 'Você não selecionou nada!',
    })
    .nonempty({ message: 'Selecione uma família' }),
  description: z
    .string({ required_error: 'A descrição e obrigatoria!' })
    .nonempty({ message: 'Preencha a descrição' }),
})

type NewBoundData = z.infer<typeof newBoundSchema>

export function SheetNewBound() {
  const newBoundForm = useForm<NewBoundData>({
    resolver: zodResolver(newBoundSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = newBoundForm

  const { loadFamily, family, loadBounds } = useBoundStore(
    ({ loadFamily, family, loadBounds }) => {
      const familyFormatted = family
        ? family?.map((item) => ({
            value: item.id.toString(),
            label: item.family,
          }))
        : []

      return {
        loadFamily,
        family: familyFormatted,
        loadBounds,
      }
    },
  )

  const { toast } = useToast()

  async function handleCreateNewBound(data: NewBoundData) {
    console.log(data)
    const response = await api
      .post('/smart-list/bound', {
        ...data,
        familyId: Number(data.family),
      })
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
      title: 'Vinculo criado com sucesso!',
      variant: 'success',
    })
    reset({ description: '', family: '' })
    loadBounds()
  }

  useEffect(() => {
    loadFamily()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Novo vinculo
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-md">
        <SheetTitle>Criar novo vinculo</SheetTitle>
        <FormProvider {...newBoundForm}>
          <form
            className="mt-4 flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleCreateNewBound)}
          >
            <Form.Field>
              <Form.Label>Família:</Form.Label>
              <Form.Select name="family" options={family} />
              <Form.ErrorMessage field="family" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Descrição:</Form.Label>
              <Form.Input name="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Button disabled={isSubmitting} loading={isSubmitting}>
              <Plus className="h-4 w-4" />
              Cadastrar
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
