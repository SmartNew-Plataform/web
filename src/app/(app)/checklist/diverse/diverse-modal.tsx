import { SelectData } from '@/@types/select-data'
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
      description: editingData?.text,
    })
  }, [editingData])

  async function handleCreateDiverse({
    branch,
    description,
    tag,
  }: DiverseFormData) {
    const response = await api.post('smart-list/location', {
      branchId: Number(branch),
      description,
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
    })
  }

  async function handleEditDiverse({ branch, description }: DiverseFormData) {
    const response = await api.put(
      `smart-list/location/${editingData?.value}`,
      {
        branchId: branch,
        description,
      },
    )

    if (response.status !== 200) return

    toast({
      title: 'Diverso atualizado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['checklist-diverse-list'])
  }

  async function fetchBranch() {
    const response: SelectData[] | undefined = await api
      .get('system/list-branch')
      .then((res) => res.data.data)

    return response
  }

  const { data, isLoading } = useQuery({
    queryKey: ['diverse-branch'],
    queryFn: fetchBranch,
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
                <Form.Select name="branch" id="branch-input" options={data} />
                <Form.ErrorMessage field="branch" />
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
