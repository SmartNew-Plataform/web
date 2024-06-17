import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface TankModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
}

const tankFormSchema = z.object({
  description: z.string({ required_error: 'Este campo e obrigatório!' }).min(1),
  tag: z.string({ required_error: 'Este campo e obrigatório!' }),
  capacity: z.coerce.number().min(0),
  branch: z.string({ required_error: 'Escolha uma filial!' }),
})

type TankFormData = z.infer<typeof tankFormSchema>

export function TankModal({ mode, ...props }: TankModalProps) {
  const diverseForm = useForm<TankFormData>({
    resolver: zodResolver(tankFormSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = diverseForm

  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleCreateTank({
    tag,
    description,
    capacity,
    branch,
  }: TankFormData) {
    const response = await api.post('fuelling/tank', {
      model: tag,
      tank: description,
      capacity,
      branchId: branch,
    })

    if (response.status !== 201) return

    toast({ title: 'Tanque criado com sucesso', variant: 'success' })

    queryClient.refetchQueries(['fuelling/create/data'])
  }

  async function fetchSelects() {
    const response = await api
      .get<{ data: SelectData[] }>('system/list-branch')
      .then((res) => res.data)

    return {
      branch: response.data,
    }
  }

  const { data: selects } = useQuery({
    queryKey: ['fuelling/create/selects'],
    queryFn: fetchSelects,
  })

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...diverseForm}>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={handleSubmit(handleCreateTank)}
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

            <Form.Field>
              <Form.Label htmlFor="capacity-input">Capacidade:</Form.Label>
              <Form.Input name="capacity" id="capacity-input" type="number" />
              <Form.ErrorMessage field="capacity" />
            </Form.Field>

            {selects?.branch ? (
              <Form.Field>
                <Form.Label htmlFor="branch-input">Filial:</Form.Label>
                <Form.Select
                  name="branch"
                  id="branch-input"
                  options={selects.branch}
                />
                <Form.ErrorMessage field="branch" />
              </Form.Field>
            ) : (
              <Form.SkeletonField />
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
