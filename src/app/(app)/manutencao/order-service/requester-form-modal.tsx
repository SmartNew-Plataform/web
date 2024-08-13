import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface RequesterFormModalProps extends ComponentProps<typeof Dialog> {}

const requesterSchema = z.object({
  name: z.string({ required_error: 'O nome e obrigatório!' }),
  email: z.string({ required_error: 'O email e obrigatório!' }).email(),
  branch: z.string({ required_error: 'O cliente e obrigatório!' }),
  notification: z.string().optional(),
  status: z.enum(['active', 'suspense']).optional(),
  observation: z.string().optional(),
})

type RequesterData = z.infer<typeof requesterSchema>

export function RequesterFormModal({
  children,
  ...props
}: RequesterFormModalProps) {
  const requesterForm = useForm<RequesterData>({
    resolver: zodResolver(requesterSchema),
  })
  const { handleSubmit, reset } = requesterForm

  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleCreateRequester(data: RequesterData) {
    const response = await api.post('/maintenance/requester', {
      ...data,
      notification: data?.notification === 'yes',
      status: data?.status === 'active',
      branchId: data.branch,
    })

    if (response.status !== 201) return

    queryClient.refetchQueries(['maintenance/service-order/requester'])
    toast({ title: 'Solicitante criado com sucesso!', variant: 'success' })
    reset({
      branch: undefined,
      email: '',
      name: '',
      notification: undefined,
      observation: '',
      status: undefined,
    })
  }

  const { data, isLoading } = useQuery({
    queryKey: ['maintenance/service-order/requester/branch'],
    queryFn: async () => {
      const response = await api
        .get('/system/list-branch')
        .then((res) => res.data)

      return response.data
    },
  })

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <FormProvider {...requesterForm}>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleCreateRequester)}
          >
            <Form.Field>
              <Form.Label required htmlFor="name">
                Nome:
              </Form.Label>
              <Form.Input name="name" id="name" />
              <Form.ErrorMessage field="name" />
            </Form.Field>
            <Form.Field>
              <Form.Label required htmlFor="email">
                E-mail:
              </Form.Label>
              <Form.Input name="email" id="email" />
              <Form.ErrorMessage field="email" />
            </Form.Field>
            {!isLoading ? (
              <Form.Field>
                <Form.Label required htmlFor="branch">
                  Filial:
                </Form.Label>
                <Form.Select options={data} name="branch" id="branch" />
                <Form.ErrorMessage field="branch" />
              </Form.Field>
            ) : (
              <Form.SkeletonField />
            )}
            <Form.Field>
              <Form.Label required htmlFor="notification">
                Notificações:
              </Form.Label>
              <Form.Select
                options={[
                  { value: 'yes', label: 'Sim' },
                  { value: 'no', label: 'Não' },
                ]}
                name="notification"
                id="notification"
              />
              <Form.ErrorMessage field="notification" />
            </Form.Field>
            <Form.Field>
              <Form.Label required htmlFor="status">
                Status:
              </Form.Label>
              <Form.Select
                options={[
                  { value: 'active', label: 'Ativo' },
                  { value: 'suspense', label: 'Suspenso' },
                ]}
                name="status"
                id="status"
              />
              <Form.ErrorMessage field="status" />
            </Form.Field>
            <Form.Field>
              <Form.Label required htmlFor="observation">
                Observação:
              </Form.Label>
              <Form.Input name="observation" id="observation" />
              <Form.ErrorMessage field="observation" />
            </Form.Field>

            <Button>
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
