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
import { useUserStore } from '@/store/user-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const newBoundSchema = z
  .object({
    type: z.enum(['family', 'diverse'], { required_error: 'Escolha um tipo!' }),
    family: z
      .array(
        z.string({
          invalid_type_error: 'Selecione uma familia!',
        }),
      )
      .optional(),
    diverse: z
      .array(
        z.string({
          required_error: 'A família e obrigatória!',
        }),
      )
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
    reset,
    watch,
    formState: { isSubmitting },
  } = newBoundForm
  const { user } = useUserStore()

  const { loadFamily, loadDiverse } = useBoundStore()

  const { toast } = useToast()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const filterText = searchParams.get('s') || ''
  // const loading = useLoading()

  async function handleCreateNewBound(data: NewBoundData) {
    try {
      // loading.show()
      await api
        .post('/smart-list/bound', {
          ...data,
          familyId: data.family,
          diverseId: data.diverse,
        })
        .then((res) => res.data)
      // .finally(() => loading.hide())

      toast({
        title: 'Vinculo criado com sucesso!',
        variant: 'success',
      })
      reset({ description: '', family: [], diverse: [], type: 'family' })
      queryClient.refetchQueries(['checklist/bounds', filterText])
    } catch (error) {
      console.log(error)
      // loading.hide()
    }
  }

  const { data } = useQuery({
    queryKey: ['checklist/bounds/selects', user?.login],
    queryFn: async () => {
      const [family, diverse] = await Promise.all([loadFamily(), loadDiverse()])

      return {
        family: family?.map(({ id, family }) => ({
          label: family,
          value: id.toString(),
        })),
        diverse,
      }
    },
    retry: true,
  })

  const type = watch('type')

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
              <>
                {data?.family ? (
                  <Form.Field>
                    <Form.Label>Família:</Form.Label>
                    <Form.MultiSelect
                      name="family"
                      options={data?.family || []}
                    />
                    <Form.ErrorMessage field="family" />
                  </Form.Field>
                ) : (
                  <Form.SkeletonField />
                )}
              </>
            ) : (
              <>
                {data?.diverse ? (
                  <Form.Field>
                    <Form.Label>Diverso:</Form.Label>
                    <Form.MultiSelect
                      name="diverse"
                      options={data?.diverse || []}
                    />
                    <Form.ErrorMessage field="diverse" />
                  </Form.Field>
                ) : (
                  <Form.SkeletonField />
                )}
              </>
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
