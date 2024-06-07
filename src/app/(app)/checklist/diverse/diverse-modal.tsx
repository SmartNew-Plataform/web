import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useDiverse } from '@/store/smartlist/diverse'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface DiverseModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
}

const diverseFormSchema = z.object({
  description: z.string({ required_error: 'Este campo e obrigatório!' }).min(1),
  branch: z.string({ required_error: 'Escola uma filial!' }),
  category: z.string({ required_error: 'Escola uma categoria!' }),
  tag: z.string({ required_error: 'Este campo e obrigatório!' }),
})

type DiverseFormData = z.infer<typeof diverseFormSchema>

export function DiverseModal({ mode, ...props }: DiverseModalProps) {
  const diverseForm = useForm<DiverseFormData>({
    resolver: zodResolver(diverseFormSchema),
  })
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = diverseForm
  const { editingData } = useDiverse()

  const { toast } = useToast()
  const queryClient = useQueryClient()

  useEffect(() => {
    reset({
      branch: editingData?.branchId.toString(),
      category: String(editingData?.categoryId),
      description: editingData?.text,
      tag: editingData?.tag,
    })
  }, [editingData])

  async function handleCreateDiverse({
    branch,
    description,
    category,
    tag,
  }: DiverseFormData) {
    const response = await api.post('smart-list/location', {
      branchId: Number(branch),
      description,
      categoryId: category,
      tag,
    })

    if (response.status !== 201) return

    toast({
      title: 'Diverso criado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['checklist-diverse-list'])
    reset({
      description: '',
      tag: '',
      branch: undefined,
      category: undefined,
    })
  }

  async function handleEditDiverse({
    branch,
    description,
    tag,
    category,
  }: DiverseFormData) {
    const response = await api.put(
      `smart-list/location/${editingData?.value}`,
      {
        branchId: branch,
        description,
        tag,
        categoryId: category,
      },
    )

    if (response.status !== 200) return

    toast({
      title: 'Diverso atualizado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['checklist-diverse-list'])
  }

  async function fetchSelects() {
    const [responseBranch, responseCategory] = await Promise.all([
      api.get('system/list-branch').then((res) => res.data.data),
      api.get('smart-list/location/category').then((res) => res.data.data),
    ])

    return {
      branch: responseBranch,
      category: responseCategory,
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['diverse-branch'],
    queryFn: fetchSelects,
  })

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...diverseForm}>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={handleSubmit(
              mode === 'edit' ? handleEditDiverse : handleCreateDiverse,
            )}
          >
            <Form.Field>
              <Form.Label htmlFor="description-input">Descrição:</Form.Label>
              <Form.Input name="description" id="description-input" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="tag-input">TAG:</Form.Label>
              <Form.Input name="tag" id="tag-input" />
              <Form.ErrorMessage field="tag" />
            </Form.Field>

            {isLoading ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label htmlFor="branch-input">Filial:</Form.Label>
                <Form.Select
                  name="branch"
                  id="branch-input"
                  options={data?.branch || []}
                />
                <Form.ErrorMessage field="branch" />
              </Form.Field>
            )}

            {isLoading ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label htmlFor="category-input">Categoria:</Form.Label>
                <Form.Select
                  name="category"
                  id="category-input"
                  options={data?.category || []}
                />
                <Form.ErrorMessage field="category" />
              </Form.Field>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
