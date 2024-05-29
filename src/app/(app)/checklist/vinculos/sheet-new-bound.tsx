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
import { validateMultipleOptions } from '@/lib/validate-multiple-options'
import { useBoundStore } from '@/store/smartlist/smartlist-bound'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const newBoundSchema = z
  .object({
    type: z.enum(['family', 'diverse'], { required_error: 'Escolha um tipo!' }),
    family: z
      .string({
        invalid_type_error: 'Você não selecionou nada!',
      })
      .optional(),
    diverse: z
      .string({
        required_error: 'A família e obrigatória!',
      })
      .optional(),
    description: z
      .string({ required_error: 'A descrição e obrigatória!' })
      .nonempty({ message: 'Preencha a descrição' }),
  })
  .superRefine((data, ctx) =>
    validateMultipleOptions<typeof data>(data, ctx, data.type),
  )

type NewBoundData = z.infer<typeof newBoundSchema>

export function SheetNewBound() {
  const newBoundForm = useForm<NewBoundData>({
    resolver: zodResolver(newBoundSchema),
    defaultValues: {
      type: 'family',
    },
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = newBoundForm

  const { loadFamily, diverse, loadDiverse } = useBoundStore(
    ({ loadFamily, family, diverse, loadDiverse }) => {
      const familyFormatted = family
        ? family?.map((item) => ({
            value: item.id.toString(),
            label: item.family,
          }))
        : []

      return {
        loadFamily,
        family: familyFormatted,
        loadDiverse,
        diverse,
      }
    },
  )

  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleCreateNewBound(data: NewBoundData) {
    console.log(data)
    const response = await api
      .post('/smart-list/bound', {
        ...data,
        familyId: Number(data.family),
        diverseId: Number(data.diverse),
      })
      .then((res) => res.data)
      .catch((err: AxiosError<{ message: string }>) => {
        toast({
          title: err.response?.data.message,
          description: err.message,
          variant: 'destructive',
          duration: 1000 * 10,
        })
        throw new Error('Insert bound error')
      })

    if (response?.error) return

    toast({
      title: 'Vinculo criado com sucesso!',
      variant: 'success',
    })
    reset({ description: '', family: '', diverse: '', type: 'family' })
    queryClient.refetchQueries(['checklist/bounds'])
  }

  useEffect(() => {
    loadFamily()
    loadDiverse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data } = useQuery({
    queryKey: ['checklist/bounds/selects'],
    queryFn: async () => {
      const family = await loadFamily()
      const diverse = await loadDiverse()

      return {
        family: family?.map(({ id, family }) => ({
          label: family,
          value: id.toString(),
        })),
        diverse,
      }
    },
  })

  const type = watch('type')

  console.log(diverse)

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
              <Form.Label>Tipo:</Form.Label>
              <Form.Select
                name="type"
                options={[
                  { label: 'Familia', value: 'family' },
                  { label: 'Diverso', value: 'diverse' },
                ]}
              />
            </Form.Field>

            {type === 'family' ? (
              <Form.Field>
                <Form.Label>Família:</Form.Label>
                <Form.Select name="family" options={data?.family || []} />
                <Form.ErrorMessage field="family" />
              </Form.Field>
            ) : (
              <Form.Field>
                <Form.Label>Diverso:</Form.Label>
                <Form.Select name="diverse" options={data?.diverse || []} />
                <Form.ErrorMessage field="diverse" />
              </Form.Field>
            )}

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
