import { TankAndTrainResponse } from '@/@types/fuelling-tank'
import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface TrainModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
  defaultValues?: TankAndTrainResponse
}

const trainFormSchema = z.object({
  description: z.string({ required_error: 'Este campo e obrigatório!' }).min(1),
  tag: z
    .string({ required_error: 'Este campo e obrigatório!' })
    .min(1, 'Este campo e obrigatório!'),
  capacity: z.coerce.number().min(0),
  branch: z.string({ required_error: 'Escolha uma filial!' }),
})

type TrainFormData = z.infer<typeof trainFormSchema>

export function TrainModal({ mode, defaultValues, ...props }: TrainModalProps) {
  const trainForm = useForm<TrainFormData>({
    resolver: zodResolver(trainFormSchema),
  })
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = trainForm

  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function fetchSelects() {
    const response = await api
      .get<{ data: SelectData[] }>('system/list-branch')
      .then((res) => res.data)

    return {
      branch: response.data,
    }
  }

  async function handleCreateTrain({
    tag,
    description,
    capacity,
    branch,
  }: TrainFormData) {
    const response = await api.post('fuelling/train', {
      tag,
      name: description,
      capacity,
      branchId: branch,
    })

    if (response.status !== 201) return

    toast({ title: 'Tanque criado com sucesso', variant: 'success' })

    queryClient.refetchQueries(['fuelling/train/data'])
  }

  async function handleEditTrain({
    tag,
    description,
    capacity,
    branch,
  }: TrainFormData) {
    const response = await api.put(`fuelling/train/${defaultValues?.id}`, {
      tag,
      name: description,
      capacity,
      branchId: branch,
    })
    if (response.status !== 200) return

    toast({
      title: 'Tanque atualizado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['fuelling/train/data'])
  }

  const { data: selects } = useQuery({
    queryKey: ['fuelling/create/train'],
    queryFn: fetchSelects,
  })

  useEffect(() => {
    if (mode === 'edit') {
      reset({
        tag: defaultValues?.tag,
        branch: defaultValues?.branch.value,
        capacity: defaultValues?.capacity,
        description: defaultValues?.train,
      })
    }
  }, [mode, defaultValues])

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...trainForm}>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={handleSubmit(
              mode === 'edit' ? handleEditTrain : handleCreateTrain,
            )}
          >
            <Form.Field>
              <Form.Label htmlFor="tag-input">TAG:</Form.Label>
              <Form.Input name="tag" id="tag-input" />
              <Form.ErrorMessage field="tag" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="description-input">Descrição:</Form.Label>
              <Form.Input name="description" id="description-input" />
              <Form.ErrorMessage field="description" />
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
